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
  console.log("[inviteSignee] START", { contractId, name, email, role });

  // 1. Fetch Contract
  let contract;
  try {
    contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { template: true },
    });
    console.log("[inviteSignee] Contract fetched", {
      found: !!contract,
      hasTemplate: !!contract?.template,
      bodyLength: contract?.template?.body?.length ?? 0,
    });
  } catch (dbErr) {
    console.error("[inviteSignee] DB ERROR fetching contract:", dbErr);
    throw dbErr;
  }

  if (!contract || !contract.template?.body) {
    console.error("[inviteSignee] MISSING contract or template body");
    throw new Error("Contract or contract template content not found.");
  }

  const signToken = crypto.randomBytes(32).toString("hex");

  // 2. Create Signer
  let signer;
  try {
    signer = await prisma.contractSigner.create({
      data: {
        contractId: contract.id,
        name,
        email,
        role,
        signToken,
        status: "PREPARING",
      },
    });
    console.log("[inviteSignee] Signer created", { signerId: signer.id });
  } catch (dbErr) {
    console.error("[inviteSignee] DB ERROR creating signer:", dbErr);
    throw dbErr;
  }

  // 3. Create System Task
  let systemTask;
  try {
    systemTask = await prisma.systemTask.create({
      data: {
        type: "PERSONALIZE_SIGNER_PDF",
        status: "PENDING",
        metadata: { signerId: signer.id, contractId: contract.id, role },
      },
    });
    console.log("[inviteSignee] SystemTask created", { taskId: systemTask.id });
  } catch (dbErr) {
    console.error("[inviteSignee] DB ERROR creating systemTask:", dbErr);
    throw dbErr;
  }

  // 4. Build payload
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
      clientRole: role,
      clientSignor: "",
      clientTitle: "",
      effectiveDate: formattedDate,
    },
  };

  const functionName = process.env.LAMBDA_CONTRACT_GENERATOR_NAME;
  console.log("[inviteSignee] Lambda config", {
    functionName,
    payloadMode: payload.mode,
    bodyLength: payload.body.length,
    webhookUrl: payload.webhookUrl,
  });

  if (!functionName) {
    console.error("[inviteSignee] MISSING ENV: LAMBDA_CONTRACT_GENERATOR_NAME");
    throw new Error("Lambda function name is not configured.");
  }

  // 5. Invoke Lambda
  let command;
  try {
    command = createCommand({
      functionName,
      payload,
      invocationType: "Event",
    });
    console.log("[inviteSignee] Command created");
  } catch (cmdErr) {
    console.error("[inviteSignee] ERROR creating command:", cmdErr);
    throw cmdErr;
  }

  try {
    const result = await lambda.send(command);
    console.log("[inviteSignee] Lambda invoke SUCCESS", {
      statusCode: result.StatusCode,
      requestId: result.$metadata?.requestId,
    });
  } catch (lambdaErr: any) {
    console.error("[inviteSignee] Lambda invoke FAILED:", {
      name: lambdaErr.name,
      message: lambdaErr.message,
      stack: lambdaErr.stack,
    });

    await prisma.contractSigner.update({
      where: { id: signer.id },
      data: { status: "FAILED" as any },
    });

    await prisma.systemTask.update({
      where: { id: systemTask.id },
      data: {
        status: "FAILED",
      },
    });
    throw new Error("Failed to personalize contract via Lambda.");
  }

  console.log("[inviteSignee] DONE");
  return { success: true, signerId: signer.id };
}
