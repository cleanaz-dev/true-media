// app/actions/invite-signer.ts
"use server"

import { prisma } from "@/lib/prisma"
import { lambda, createCommand } from "@/lib/aws/lambda"
import crypto from "crypto"

export async function inviteSignee({
  contractId,
  name,
  email,
  role
}: {
  contractId: string
  name: string
  email: string
  role: string
}) {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      template: true
    }
  })

  if (!contract || !contract.template?.body) {
    throw new Error("Contract or contract content not found.")
  }

  const signToken = crypto.randomBytes(32).toString("hex")

  // 1. Create Signer in PREPARING status
  const signer = await prisma.contractSigner.create({
    data: {
      contractId: contract.id,
      name,
      email,
      signToken,
      status: "PREPARING",
    },
  })

  // 2. Create Task for Webhook Callback
  const systemTask = await prisma.systemTask.create({
    data: {
      type: "PERSONALIZE_SIGNER_PDF",
      status: "PENDING",
      metadata: {
        signerId: signer.id,
        contractId: contract.id,
      },
    },
  })

  // 3. Format today's date for preamble preview
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // 4. Invoke Lambda (Fast Personalization ~150ms)
  const payload = {
    mode: "PERSONALIZE",
    title: contract.title,
    body: contract.template.body, // The master markdown stored in contract.content
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/system-task/${systemTask.id}`,
    metadata: {
      signerId: signer.id,
      companyName: "True Sports and Entertainment Inc.",
      companySignor: "Raymond Kingu Jr.",
      companyTitle: "President & CEO",
      clientName: signer.name,
      clientSignor: "", // Blank until they sign
      clientTitle: "",
      effectiveDate: formattedDate,
    },
  }

  const command = createCommand({
    functionName: process.env.LAMBDA_CONTRACT_GENERATOR_NAME!,
    payload,
    invocationType: "Event",
  })

  await lambda.send(command)

  return { success: true, signerId: signer.id }
}