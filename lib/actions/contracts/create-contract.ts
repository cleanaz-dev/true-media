// app/actions/contracts.ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { lambda, createCommand } from "@/lib/aws/lambda"

export async function createContractAction(formData: FormData) {
  const title = formData.get("title") as string
  const contractType = formData.get("contractType") as string
  const requirements = formData.get("requirements") as string
  const templateId = formData.get("templateId") as string | null

  // ==========================================
  // 0. LOAD TEMPLATE (IF SELECTED)
  // ==========================================

  const template = templateId
    ? await prisma.contractTemplate.findUnique({
        where: { id: templateId },
        select: { id: true, name: true, body: true, s3Key: true },
      })
    : null

  // ==========================================
  // 1. CREATE CONTRACT DRAFT RECORD IN DATABASE
  // ==========================================

  const contract = await prisma.contract.create({
    data: {
      title,
      status: "DRAFT",
      templateId: template?.id ?? null,
    },
  })

  // ==========================================
  // 2. CREATE SYSTEM TASK
  // ==========================================

  const systemTask = await prisma.systemTask.create({
    data: {
      type: "GENERATE_CONTRACT_PDF",
      status: "PENDING",
      metadata: {
        contractId: contract.id,
        contractType,
        requirements,
        templateId: template?.id ?? null,
      },
    },
  })

  // ==========================================
  // 3. CREATE PAYLOAD FOR LAMBDA INVOCATION
  // ==========================================
  const payload = {
    contractType,
    requirements,
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/system-task/${systemTask.id}`,
    scrapeInternet: false,
    template: template
      ? {
          name: template.name,
          body: template.body ?? undefined,
          s3Key: template.s3Key ?? undefined,
        }
      : null,
  }

  const command = createCommand({
    functionName: process.env.LAMBDA_CONTRACT_GENERATOR_NAME!,
    payload: payload,
    invocationType: "Event",
  })

  try {
    await lambda.send(command)
  } catch (error) {
    console.error("Lambda Invocation Failed:", error)
    throw new Error("Failed to generate contract via Lambda")
  }

  revalidatePath("/admin/contracts")
  redirect("/admin/contracts")
}