import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send-email";
import InviteSigneeEmail from "@/lib/email/templates/invite-signee-email";

const lambdaWebhookPayloadSchema = z.object({
  status: z.enum(["COMPLETED", "FAILED"]),
  mode: z.literal("PERSONALIZE").optional(),
  s3Key: z.string().optional(), // FIX: optional so FAILED payloads validate
  signerId: z.string().optional(),
  error: z.string().optional(),
});

const systemTaskMetadataSchema = z.object({
  signerId: z.string().min(1, "signerId required in task metadata"),
  contractId: z.string().min(1, "contractId required in task metadata"),
});

export async function handlePersonalizePdf(
  systemTask: { id: string; metadata: unknown },
  data: unknown
) {
  const parsedData = lambdaWebhookPayloadSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("[handlePersonalizePdf] Payload invalid:", z.flattenError(parsedData.error));
    throw new Error(`Invalid Lambda webhook payload: ${parsedData.error.message}`);
  }

  const { status, s3Key, error, signerId: payloadSignerId } = parsedData.data;

  if (status === "FAILED") {
    throw new Error(`Lambda personalization failed: ${error || "Unknown error"}`);
  }

  // Only require s3Key when we know the Lambda succeeded
  if (!s3Key) {
    throw new Error("Lambda completed but s3Key is missing from payload.");
  }

  const parsedMetadata = systemTaskMetadataSchema.safeParse(systemTask.metadata);
  if (!parsedMetadata.success) {
    throw new Error(`Invalid SystemTask metadata: ${parsedMetadata.error.message}`);
  }

  const { signerId, contractId } = parsedMetadata.data;

  const updatedSigner = await prisma.contractSigner.update({
    where: { id: signerId },
    data: {
      contractKey: s3Key,
      status: "PENDING",
    },
    include: {
      contract: { select: { title: true } },
    },
  });

  if (!updatedSigner.signToken) {
    throw new Error(`Signer ${signerId} is missing a signToken.`);
  }
  if (!updatedSigner.email) {
    throw new Error(`Signer ${signerId} is missing an email address.`);
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  const signUrl = `${appUrl}/onboarding/${updatedSigner.signToken}`;

  try {
    await sendEmail({
      to: updatedSigner.email,
      subject: `Signature Request: ${updatedSigner.contract.title}`,
      react: InviteSigneeEmail({
        signerName: updatedSigner.name,
        contractTitle: updatedSigner.contract.title,
        signUrl,
        inviterName: "True Sports & Entertainment",
      }),
    });
    console.log(`[handlePersonalizePdf] Email sent to ${updatedSigner.email}`);
  } catch (emailErr) {
    console.error(`[handlePersonalizePdf] Email failed:`, emailErr);
  }

  return { success: true, signerId: updatedSigner.id, s3Key };
}