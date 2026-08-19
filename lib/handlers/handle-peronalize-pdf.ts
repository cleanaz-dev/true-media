import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send-email";
import InviteSigneeEmail from "@/lib/email/templates/invite-signee-email";
// If your sendEmail() needs an HTML string instead of a React node, uncomment below:
// import { render } from "@react-email/render";

const lambdaWebhookPayloadSchema = z.object({
  status: z.enum(["COMPLETED", "FAILED"]),
  mode: z.literal("PERSONALIZE").optional(),
  s3Key: z.string().min(1, "s3Key is required"),
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
  // A. Validate Lambda payload
  const parsedData = lambdaWebhookPayloadSchema.safeParse(data);
  if (!parsedData.success) {
    console.error("[handlePersonalizePdf] Payload invalid:", parsedData.error.flatten());
    throw new Error(`Invalid Lambda webhook payload: ${parsedData.error.message}`);
  }

  const { status, s3Key, error } = parsedData.data;

  if (status === "FAILED") {
    throw new Error(`Lambda personalization failed: ${error || "Unknown error"}`);
  }

  // B. Validate Task Metadata
  const parsedMetadata = systemTaskMetadataSchema.safeParse(systemTask.metadata);
  if (!parsedMetadata.success) {
    console.error("[handlePersonalizePdf] Metadata invalid:", parsedMetadata.error.flatten());
    throw new Error(`Invalid SystemTask metadata: ${parsedMetadata.error.message}`);
  }

  const { signerId, contractId } = parsedMetadata.data;

  // C. Update signer with the personalized PDF key
  const updatedSigner = await prisma.contractSigner.update({
    where: { id: signerId },
    data: {
      contractKey: s3Key,
      status: "PENDING",
    },
    include: {
      contract: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!updatedSigner.signToken) {
    throw new Error(`Signer ${signerId} is missing a signToken.`);
  }
  if (!updatedSigner.email) {
    throw new Error(`Signer ${signerId} is missing an email address.`);
  }

  // D. Build signing link
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";
  const signUrl = `${appUrl}/onboarding/${updatedSigner.signToken}`;

  // E. Send invite email
  try {
    await sendEmail({
      to: updatedSigner.email,
      subject: `Signature Request: ${updatedSigner.contract.title}`,
      // FIX 1: InviteSigneeEmail expects `signUrl`, NOT `signingUrl`
      // FIX 2: InviteSigneeEmail does NOT accept a `role` prop
      react: InviteSigneeEmail({
        signerName: updatedSigner.name,
        contractTitle: updatedSigner.contract.title,
        signUrl,
        inviterName: "True Sports & Entertainment",
      }),
      // If sendEmail() expects an HTML string instead of a React node, replace
      // the `react:` line above with:
      // html: render(InviteSigneeEmail({ signerName: updatedSigner.name, contractTitle: updatedSigner.contract.title, signUrl })),
    });
    console.log(`[handlePersonalizePdf] Email sent to ${updatedSigner.email}`);
  } catch (emailErr) {
    console.error(`[handlePersonalizePdf] Email failed:`, emailErr);
    // Non-fatal: we keep the PDF / task success even if email bounces
  }

  return { success: true, signerId: updatedSigner.id, s3Key };
}