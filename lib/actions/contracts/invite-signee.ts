// lib/actions/contracts/invite-signee.ts
"use server";

import { prisma } from "@/lib/prisma";
import { lambda, createCommand } from "@/lib/aws/lambda";
import crypto from "crypto";

export async function inviteSignee({
  contractId,
  name,
  email,
  role = "Client",
}: {
  contractId: string;
  name: string;
  email: string;
  role?: string;
}) {
  // 1. Fetch Contract and its Template Body
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      template: true,
    },
  });

  if (!contract || !contract.template?.body) {
    throw new Error("Contract or contract template content not found.");
  }

  const signToken = crypto.randomBytes(32).toString("hex");

  // 2. Create Signer in PREPARING status with assigned role
  const signer = await prisma.contractSigner.create({
    data: {
      contractId: contract.id,
      name,
      email,
      role, // 👈 Saved role to DB
      signToken,
      status: "PREPARING",
    },
  });

  // 3. Create System Task for Webhook tracking
  const systemTask = await prisma.systemTask.create({
    data: {
      type: "PERSONALIZE_SIGNER_PDF",
      status: "PENDING",
      metadata: {
        signerId: signer.id,
        contractId: contract.id,
        role,
      },
    },
  });

  // 4. Format date for preview
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // 5. Invoke Lambda (Fast Personalization ~150ms)
  const payload = {
    mode: "PERSONALIZE",
    title: contract.title,
    body: contract.template.body,
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/system-task/${systemTask.id}`,
    metadata: {
      signerId: signer.id,
      companyName: "True Sports and Entertainment Inc.",
      companySignor: "Raymond Kingu Jr.",
      companyTitle: "President & CEO",
      clientName: signer.name,
      clientRole: role, // 👈 Injects into preamble & signature header
      clientSignor: "", // Blank until signed
      clientTitle: "",
      effectiveDate: formattedDate,
    },
  };

  const command = createCommand({
    functionName: process.env.LAMBDA_CONTRACT_GENERATOR_NAME!,
    payload,
    invocationType: "Event",
  });

  try {
    await lambda.send(command);
  } catch (error) {
    console.error("[inviteSignee] Lambda personalization invocation failed:", error);
    // Mark signer failed if invocation fails
    await prisma.contractSigner.update({
      where: { id: signer.id },
      data: { status: "FAILED" as any },
    });
    throw new Error("Failed to personalize contract via Lambda.");
  }

  return { success: true, signerId: signer.id };
}