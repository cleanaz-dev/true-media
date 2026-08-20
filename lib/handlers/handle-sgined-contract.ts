import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { sendEmail } from "@/lib/email/send-email";
import { ContractSignedCompletedEmail } from "@/lib/email/templates/contract-completed";
import { getPdfSignedUrl } from "@/lib/aws/s3";

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

  // 1. Update the SIGNER's contractKey to the sealed PDF — contract is NEVER touched
  const signer = await prisma.contractSigner.findFirst({
    where: { contractId },
    include: { contract: { select: { title: true } } }, // read-only, for the email
  });
  if (!signer) throw new Error("Signer not found for contract");

  await prisma.contractSigner.update({
    where: { id: signer.id },
    data: { contractKey: parsed.s3Key },
  });

  // 2. Mark the task done
  await prisma.systemTask.update({
    where: { id: systemTask.id },
    data: { status: "COMPLETED" },
  });

  // 3. Email the signer their executed copy
  const downloadUrl = await getPdfSignedUrl(parsed.s3Key, 60 * 60 * 24 * 7);

  await sendEmail({
    to: signer.email,
    subject: `Fully Executed: ${signer.contract.title}`,
    react: ContractSignedCompletedEmail({
      recipientName: signer.name,
      contractTitle: signer.contract.title,
      downloadUrl,
    }),
  });

  return { success: true };
}

