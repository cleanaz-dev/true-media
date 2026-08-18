"use server";

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send-email";
import { InviteSigneeEmail } from "@/lib/email/templates/invite-signee-email";
import crypto from "crypto";
import { revalidatePath } from "next/cache";

export async function inviteSignee({
  contractId,
  email,
  name,
}: {
  contractId: string;
  email: string;
  name?: string;
}) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
  });

  if (!contract) {
    throw new Error("Contract not found");
  }

  // 1. Generate unique signToken
  const signToken = crypto.randomBytes(32).toString("hex");

  // 2. Create ContractSigner record
  const signer = await prisma.contractSigner.create({
    data: {
      contractId,
      email,
      name: name || email,
      signToken,
      status: "PENDING",
    },
  });

  // 3. Build the token URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const signUrl = `${appUrl}/onboarding/${signToken}`;

  // 4. Send Email
  await sendEmail({
    to: email,
    subject: `Signature Request: ${contract.title}`,
    react: InviteSigneeEmail({
      signerName: signer.name,
      contractTitle: contract.title,
      signUrl: signUrl,
    }),
  });

  revalidatePath(`/admin/contracts/${contractId}`);
  return { success: true, signer };
}