// lib/actions/contracts/submit-signature.ts
"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getFileBuffer, uploadFilePrivate } from "@/lib/aws/s3";
import { sealContractWithSignatures } from "@/lib/pdf/contract-seal";
import { sendEmail } from "@/lib/email/send-email";
import { ContractSignedCompletedEmail } from "@/lib/email/templates/contract-completed";
import { revalidatePath } from "next/cache";

export async function submitSignature({
  signToken,
  printedName,
  signatureImage,
}: {
  signToken: string;
  printedName: string;
  signatureImage: string;
}) {
  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  // 1. Fetch THIS specific signer and their contract
  const signer = await prisma.contractSigner.findUnique({
    where: { signToken },
    include: { contract: true },
  });

  if (!signer) throw new Error("Signer not found.");
  if (signer.status === "SIGNED") throw new Error("Already signed.");
  if (!signer.contract.originalS3Key) throw new Error("Original document not found.");

  const now = new Date();

  // 2. Download the clean original template PDF
  const originalPdfBuffer = await getFileBuffer(signer.contract.originalS3Key);

  // 3. Seal ONLY this signer's signature onto their copy
  const sealedPdfBuffer = await sealContractWithSignatures({
    originalPdfBuffer,
    signers: [
      {
        name: printedName,
        email: signer.email,
        signatureTxt: signatureImage,
        signedAt: now,
        ipAddress,
      },
    ],
    contractTitle: signer.contract.title,
  });

  // 4. Upload THIS signer's sealed PDF
  const completedKey = `contracts/completed/${signer.id}-${Date.now()}.pdf`;
  await uploadFilePrivate(completedKey, sealedPdfBuffer, "application/pdf");

  // 5. Update THIS signer with their signed PDF & audit data
  await prisma.contractSigner.update({
    where: { id: signer.id },
    data: {
      name: printedName,
      signatureTxt: signatureImage,
      status: "SIGNED",
      signedAt: now,
      ipAddress,
      userAgent,
      contractKey: completedKey,
    },
  });

  // 6. Send completion email to THIS signer
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    await sendEmail({
      to: signer.email,
      subject: `Completed Agreement: ${signer.contract.title}`,
      react: ContractSignedCompletedEmail({
        recipientName: printedName,
        contractTitle: signer.contract.title,
        downloadUrl: `${appUrl}/onboarding/${signer.signToken}`,
      }),
    });
  } catch (err) {
    console.error("[submitSignature] Email send error:", err);
  }

  revalidatePath(`/onboarding/${signToken}`);
  return { success: true };
}