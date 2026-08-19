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

  // 💡 Extract dynamic roles array submitted from the form
  const rawRoles = formData.getAll("roles") as string[]
  const roles = rawRoles.length > 0 ? rawRoles : ["Client"]

  // 1. Load Template (if selected)
  const template = templateId
    ? await prisma.contractTemplate.findUnique({
        where: { id: templateId },
        select: { id: true, name: true, body: true, s3Key: true },
      })
    : null

  // 2. Create Contract Draft with assigned roles
  const contract = await prisma.contract.create({
    data: {
      title,
      status: "DRAFT",
      templateId: template?.id ?? null,
      roles, // 👈 Saved to Contract model
    },
  })

  // 3. Create System Task
  const systemTask = await prisma.systemTask.create({
    data: {
      type: "GENERATE_CONTRACT_PDF",
      status: "PENDING",
      metadata: {
        contractId: contract.id,
        contractType,
        requirements,
        roles,
      },
    },
  })

  // 4. Invoke Lambda (Master Generation)
  const payload = {
    mode: "GENERATE",
    title,
    contractType,
    requirements,
    template: template?.body ? { body: template.body } : null,
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/system-task/${systemTask.id}`,
    metadata: {
      contractId: contract.id,
      companyName: "True Sports and Entertainment Inc.",
      companySignor: "Raymond Kingu Jr.",
      companyTitle: "President & CEO",
      roles,
    },
  }

  const command = createCommand({
    functionName: process.env.LAMBDA_CONTRACT_GENERATOR_NAME!,
    payload,
    invocationType: "Event",
  })

  try {
    await lambda.send(command)
  } catch (error) {
    console.error("Lambda Master Generation Failed:", error)
    throw new Error("Failed to generate master contract via Lambda")
  }

  revalidatePath("/admin/contracts")
  redirect("/admin/contracts")
}