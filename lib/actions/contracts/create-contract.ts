// app/actions/contracts.ts
"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { randomUUID } from "crypto"
import { lambda, createCommand } from "@/lib/aws/lambda"


export async function createContractAction(formData: FormData) {
  const title = formData.get("title") as string
  const contractType = formData.get("contractType") as string
  const requirements = formData.get("requirements") as string

  // Parse dynamic signers
  const signers: { name: string; email: string }[] = []
  let index = 0
  while (formData.has(`signers[${index}].name`)) {
    signers.push({
      name: formData.get(`signers[${index}].name`) as string,
      email: formData.get(`signers[${index}].email`) as string,
    })
    index++
  }

  // ==========================================
  // 1. CREATE CONTRACT DRAFT RECORD IN DATABASE
  // ==========================================

  const contract = await prisma.contract.create({
    data: {
      title,
      status: "DRAFT",
      // originalS3Key: responsePayload.s3Url, <-- If lambda handles S3
      
      signers: {
        create: signers.map((signer) => ({
          name: signer.name,
          email: signer.email,
          signToken: randomUUID(),
          status: "PENDING",
        })),
      },
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
      },
    },
  })

  // ==========================================
  // 4. CREATE PAYLOAD FOR LAMBDA INVOCATION
  // ==========================================
  const payload = {
    contractType,
    requirements,
    webhookUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/system-task/${systemTask.id}`,
    scrapeInternet: false 
  }

  const command = createCommand({
    functionName: process.env.LAMBDA_CONTRACT_GENERATOR_NAME!, // e.g., "generate-contract-lambda"
    payload: payload,
    invocationType: "Event"
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