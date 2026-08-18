// lib/actions/contracts/invite-signee.ts
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

  // 2. Create the signer in the DB
  const signer = await prisma.contractSigner.create({
    data: {
      contractId,
      email,
      name: name || email,
      signToken,
      status: "PENDING",
    },
  });

  // 3. Try to send the email
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const signUrl = `${appUrl}/onboarding/${signToken}`;

    await sendEmail({
      to: email,
      subject: `Signature Request: ${contract.title}`,
      react: InviteSigneeEmail({
        signerName: signer.name,
        contractTitle: contract.title,
        signUrl: signUrl,
      }),
    });
  } catch (err) {
    // ⚠️ ROLLBACK: If email delivery fails, remove the signer so there's no ghost record
    console.error("[inviteSignee] Email failed to send, rolling back signer creation:", err);
    
    await prisma.contractSigner.delete({
      where: { id: signer.id },
    });

    throw new Error(
      err instanceof Error ? `Failed to send email: ${err.message}` : "Failed to send invitation email."
    );
  }

  // 4. If everything succeeded:
  revalidatePath(`/admin/contracts/${contractId}`);
  return { success: true, signer };
}