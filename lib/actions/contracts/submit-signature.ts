"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { lambda, createCommand } from "@/lib/aws/lambda";

interface SubmitSignatureParams {
  signToken: string;
  printedName: string;
  signatureTxt: string; // base64 PNG data URL from the signature pad
  title?: string;
}

export async function submitSignature({
  signToken,
  printedName,
  signatureTxt,
  title,
}: SubmitSignatureParams) {
  if (!signatureTxt || !signatureTxt.startsWith("data:image/png")) {
    throw new Error("A valid drawn signature is required.");
  }

  const headerList = await headers();
  const ipAddress =
    headerList.get("x-forwarded-for")?.split(",")[0] ||
    headerList.get("x-real-ip") ||
    "unknown";
  const userAgent = headerList.get("user-agent") || "unknown";

  // 1. Fetch signer + contract
  const signer = await prisma.contractSigner.findUnique({
    where: { signToken },
    include: { contract: true },
  });

  if (!signer) throw new Error("Invalid or expired signature token.");
  if (signer.status === "SIGNED") throw new Error("You have already signed this contract.");
  if (!signer.contractKey) {
    throw new Error("Contract PDF is not available for signing yet.");
  }

  // 2. Mark as signed — ONE signer, so signing = contract complete
  const signedAt = new Date();
  const signerTitle = title || signer.role;

  await prisma.contractSigner.update({
    where: { id: signer.id },
    data: {
      status: "SIGNED",
      signedAt,
      name: printedName,
      title: signerTitle,
      signatureTxt,
      ipAddress,
      userAgent,
    },
  });

  await prisma.contract.update({
    where: { id: signer.contractId },
    data: { status: "COMPLETED" },
  });

  // 3. Fire Lambda to seal the PDF
  const systemTask = await prisma.systemTask.create({
    data: {
      type: "SEAL_CONTRACT",
      status: "PENDING",
      metadata: { contractId: signer.contractId },
    },
  });

  const payload = {
    mode: "SIGN",
    s3Key: signer.contractKey,
    title: signer.contract.title,
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/system-task/${systemTask.id}`,
    metadata: {
      contractId: signer.contractId,
      signer: {
        name: printedName,
        email: signer.email,
        title: signerTitle,
        signatureTxt,
        signedAt: signedAt.toISOString(),
        ipAddress,
      },
    },
  };

  const functionName = process.env.LAMBDA_CONTRACT_GENERATOR_NAME;
  if (!functionName) throw new Error("Lambda function name not configured.");

  await lambda.send(
    createCommand({ functionName, payload, invocationType: "Event" })
  );

  revalidatePath(`/onboarding/${signToken}`);
  return { success: true, contractCompleted: true };
}

