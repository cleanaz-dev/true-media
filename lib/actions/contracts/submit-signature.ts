"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFileBuffer, uploadFilePrivate } from "@/lib/aws/s3";
import { sealContractWithSignatures } from "@/lib/pdf/contract-seal";
import { sendEmail } from "@/lib/email/send-email";
import ContractSignedCompletedEmail from "@/lib/email/templates/contract-completed";


interface SubmitSignatureParams {
  signToken: string;
  signatureTxt: string; // base64 PNG or typed name
}

export async function submitSignature({
  signToken,
  signatureTxt,
}: SubmitSignatureParams) {
  // Capture client IP & user agent for audit log
  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  // 1. Fetch the signer and contract
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
    throw new Error("Invalid signature request token");
  }

  if (currentSigner.status === "SIGNED") {
    throw new Error("You have already signed this contract");
  }

  // 2. Mark this signer as SIGNED
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

  // 3. Fetch all signers to check if the contract is fully signed
  const allSigners = await prisma.contractSigner.findMany({
    where: { contractId: currentSigner.contractId },
  });

  const isEveryoneSigned = allSigners.every((s) =>
    s.id === currentSigner.id ? true : s.status === "SIGNED"
  );

  // 4. If everyone has signed, execute the completion flow
  if (isEveryoneSigned && currentSigner.contract.originalS3Key) {
    try {
      // A. Download original unsigned PDF from S3
      const originalPdfBuffer = await getFileBuffer(
        currentSigner.contract.originalS3Key
      );

      // B. Seal PDF with signature audit page
      const sealedPdfBuffer = await sealContractWithSignatures({
        originalPdfBuffer,
        signers: allSigners.map((s) =>
          s.id === currentSigner.id
            ? { ...s, signatureTxt, signedAt: new Date(), ipAddress }
            : s
        ),
        contractTitle: currentSigner.contract.title,
      });

      // C. Upload completed PDF to S3
      const completedKey = `contracts/completed/${currentSigner.contractId}-${Date.now()}.pdf`;
      await uploadFilePrivate(completedKey, sealedPdfBuffer, "application/pdf");

      // D. Update Contract to COMPLETED
      await prisma.contract.update({
        where: { id: currentSigner.contractId },
        data: {
          status: "COMPLETED",
          completedS3Key: completedKey,
        },
      });

      // E. STEP C: Send completion emails to all signers
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      for (const signer of allSigners) {
        const downloadUrl = `${appUrl}/onboarding/${signer.signToken}`;
        await sendEmail({
          to: signer.email,
          subject: `Completed: ${currentSigner.contract.title}`,
          react: ContractSignedCompletedEmail({
            recipientName: signer.name,
            contractTitle: currentSigner.contract.title,
            downloadUrl,
          }),
        });
      }
    } catch (err) {
      console.error("[sealContract] Failed to seal or email completed contract:", err);
      // Non-blocking throw so the signer's individual signature is still preserved
    }
  }

  revalidatePath(`/onboarding/${signToken}`);
  return { success: true };
}