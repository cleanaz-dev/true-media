"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import { ContractSignedCompletedEmail } from "@/lib/email/templates/contract-completed";
import { revalidatePath } from "next/cache";

interface SubmitSignatureParams {
  signToken: string;
  printedName: string;      // "John Doe"
  signatureImage: string;   // "data:image/png;base64,..."
}

export async function submitSignature({
  signToken,
  printedName,
  signatureImage,
}: SubmitSignatureParams) {
  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  const currentSigner = await prisma.contractSigner.findUnique({
    where: { signToken },
    include: {
      contract: {
        include: { signers: true },
      },
    },
  });

  if (!currentSigner) {
    throw new Error("Invalid or expired signature token.");
  }

  if (currentSigner.status === "SIGNED") {
    throw new Error("You have already signed this contract.");
  }

  // 1. Save both printed name and drawn signature image
  await prisma.contractSigner.update({
    where: { id: currentSigner.id },
    data: {
      name: printedName,
      signatureTxt: signatureImage,
      status: "SIGNED",
      signedAt: new Date(),
      ipAddress,
      userAgent,
    },
  });

  // 2. Check if all parties have completed signing
  const allSigners = await prisma.contractSigner.findMany({
    where: { contractId: currentSigner.contractId },
  });

  const isEveryoneSigned = allSigners.every((s) =>
    s.id === currentSigner.id ? true : s.status === "SIGNED"
  );

  if (isEveryoneSigned) {
    await prisma.contract.update({
      where: { id: currentSigner.contractId },
      data: { status: "COMPLETED" },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    for (const signer of allSigners) {
      if (!signer.email || !signer.signToken) continue;
      const downloadUrl = `${appUrl}/onboarding/${signer.signToken}`;

      try {
        await sendEmail({
          to: signer.email,
          subject: `Fully Executed: ${currentSigner.contract.title}`,
          react: ContractSignedCompletedEmail({
            recipientName: signer.name,
            contractTitle: currentSigner.contract.title,
            downloadUrl,
          }),
        });
      } catch (emailErr) {
        console.error(`[submitSignature] Failed sending completion email to ${signer.email}:`, emailErr);
      }
    }
  }

  revalidatePath(`/onboarding/${signToken}`);
  return { success: true, contractCompleted: isEveryoneSigned };
}