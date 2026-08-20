import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send-email";
import { ContractSignedCompletedEmail } from "@/lib/email/templates/contract-completed";
import { getPdfSignedUrl } from "@/lib/aws/s3"; // <-- adjust to wherever your presign helper lives

const signedPayloadSchema = z.object({
  status: z.string(),
  s3Key: z.string().min(1),
});

export async function handleSignedContract(
  systemTask: { id: string; metadata: unknown },
  data: unknown
) {
  const parsed = signedPayloadSchema.parse(data);
  const contractId = (systemTask.metadata as { contractId?: string })?.contractId;
  if (!contractId) throw new Error("Missing contractId in system task metadata");

  // 1. Point the contract at the sealed PDF
  const contract = await prisma.contract.update({
    where: { id: contractId },
    data: {
      contractKey: parsed.s3Key,
      status: "COMPLETED",
    },
  });

  // 2. Mark the task done
  await prisma.systemTask.update({
    where: { id: systemTask.id },
    data: { status: "COMPLETED" },
  });

  // 3. Email the ONE signer their executed copy
  const signer = await prisma.contractSigner.findFirst({
    where: { contractId },
  });

  if (signer) {
    // 7 days = max SigV4 presign expiry
    const downloadUrl = await getPdfSignedUrl(parsed.s3Key, 60 * 60 * 24 * 7);

    await sendEmail({
      to: signer.email,
      subject: `Fully Executed: ${contract.title}`,
      react: ContractSignedCompletedEmail({
        recipientName: signer.name,
        contractTitle: contract.title,
        downloadUrl,
      }),
    });
  }

  return { success: true };
}
