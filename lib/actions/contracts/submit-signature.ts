"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import { ContractSignedCompletedEmail } from "@/lib/email/templates/contract-completed";
import { getFileBuffer, uploadFilePrivate } from "@/lib/aws/s3";
import { sealContractWithSignatures } from "@/lib/pdf/contract-seal";
import { revalidatePath } from "next/cache";

interface SubmitSignatureParams {
  signToken: string;
  printedName: string;
  signatureImage: string; // data:image/png;base64,...
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

  // 1. Fetch current signer
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

  // 2. Mark this signer as SIGNED with real canvas PNG and timestamp
  const now = new Date();
  await prisma.contractSigner.update({
    where: { id: currentSigner.id },
    data: {
      name: printedName,
      signatureTxt: signatureImage,
      status: "SIGNED",
      signedAt: now,
      ipAddress,
      userAgent,
    },
  });

  // 3. Fetch all signers to check completion
  const allSigners = await prisma.contractSigner.findMany({
    where: { contractId: currentSigner.contractId },
  });

  const isEveryoneSigned = allSigners.every((s) =>
    s.id === currentSigner.id ? true : s.status === "SIGNED"
  );

  // 4. Seal PDF if all parties have completed
  if (isEveryoneSigned && currentSigner.contract.originalS3Key) {
    try {
      // Download original clean PDF
      const originalPdfBuffer = await getFileBuffer(
        currentSigner.contract.originalS3Key
      );

      // Prepare signer audit data with updated values
      const signersToSeal = allSigners.map((s) => {
        if (s.id === currentSigner.id) {
          return {
            name: printedName,
            email: s.email,
            signatureTxt: signatureImage,
            signedAt: now,
            ipAddress,
          };
        }
        return {
          name: s.name,
          email: s.email,
          signatureTxt: s.signatureTxt,
          signedAt: s.signedAt,
          ipAddress: s.ipAddress,
        };
      });

      const sealedPdfBuffer = await sealContractWithSignatures({
        originalPdfBuffer,
        signers: signersToSeal,
        contractTitle: currentSigner.contract.title,
      });

      // Save as unique completed key to prevent cache collisions
      const completedKey = `contracts/completed/${currentSigner.contractId}-${Date.now()}.pdf`;
      await uploadFilePrivate(completedKey, sealedPdfBuffer, "application/pdf");

      await prisma.contract.update({
        where: { id: currentSigner.contractId },
        data: {
          status: "COMPLETED",
          completedS3Key: completedKey,
        },
      });

      // Send clean emails without emojis in the subject line
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      for (const signer of allSigners) {
        if (!signer.email || !signer.signToken) continue;
        const downloadUrl = `${appUrl}/onboarding/${signer.signToken}`;

        try {
          await sendEmail({
            to: signer.email,
            subject: `Completed Agreement: ${currentSigner.contract.title}`, // Clean subject line (no spam symbols)
            react: ContractSignedCompletedEmail({
              recipientName: signer.id === currentSigner.id ? printedName : signer.name,
              contractTitle: currentSigner.contract.title,
              downloadUrl,
            }),
          });
        } catch (emailErr) {
          console.error(`[submitSignature] Error sending email to ${signer.email}:`, emailErr);
        }
      }
    } catch (sealErr) {
      console.error("[submitSignature] Failed to seal PDF:", sealErr);
    }
  }

  revalidatePath(`/onboarding/${signToken}`);
  return { success: true, contractCompleted: isEveryoneSigned };
}