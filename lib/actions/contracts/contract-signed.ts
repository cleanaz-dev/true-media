"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import { ContractSignedCompletedEmail } from "@/lib/email/templates/contract-completed";
import { revalidatePath } from "next/cache";

interface SubmitSignatureParams {
  signToken: string;
  signatureTxt: string; // The typed name or canvas signature string
}

export async function submitSignature({
  signToken,
  signatureTxt,
}: SubmitSignatureParams) {
  // 1. Capture Client Audit Info
  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  // 2. Fetch the Signer + Contract
  const currentSigner = await prisma.contractSigner.findUnique({
    where: { signToken },
    include: {
      contract: {
        include: {
          signers: true,
        },
      },
    },
  });

  if (!currentSigner) {
    throw new Error("Invalid or expired signature token.");
  }

  if (currentSigner.status === "SIGNED") {
    throw new Error("You have already signed this contract.");
  }

  // 3. Mark current signer as SIGNED with audit trail
  await prisma.contractSigner.update({
    where: { id: currentSigner.id },
    data: {
      status: "SIGNED",
      signedAt: new Date(),
      signatureTxt,
      ipAddress,
      userAgent,
    },
  });

  // 4. Fetch all signers to check if everyone is done
  const allSigners = await prisma.contractSigner.findMany({
    where: { contractId: currentSigner.contractId },
  });

  const isEveryoneSigned = allSigners.every((s) =>
    s.id === currentSigner.id ? true : s.status === "SIGNED"
  );

  // 5. If ALL parties have signed -> Complete contract and notify everyone
  if (isEveryoneSigned) {
    await prisma.contract.update({
      where: { id: currentSigner.contractId },
      data: {
        status: "COMPLETED",
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Send the completion email to all signers
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