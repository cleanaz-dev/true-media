// lib/handlers/handle-generate-contract.ts
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 1. Define the schema for what we expect in the SystemTask.metadata
const TaskMetadataSchema = z.object({
  contractId: z.string().min(1, "contractId is required in metadata"),
  contractType: z.string().optional(),
  requirements: z.string().optional(),
})

// 2. Define the schema for what the Lambda sends back to us
const LambdaResponseSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("COMPLETED"),
    s3Key: z.string().min(1, "s3Key is required on success"),
  }),
  z.object({
    status: z.literal("FAILED"),
    error: z.string().optional().default("Unknown Lambda error"),
  }),
])

export async function handleGenerateContractPdf(
  systemTask: { id: string; metadata: unknown },
  data: unknown,
) {
  // 1. Parse and validate the task metadata
  const metadata = TaskMetadataSchema.parse(systemTask.metadata)

  // 2. Parse and validate the incoming Lambda payload
  const payload = LambdaResponseSchema.parse(data)

  // 3. Handle explicit failure states passed back by the Lambda
  if (payload.status === "FAILED") {
    throw new Error(payload.error)
  }

  // 4. Update the Contract record 
  await prisma.contract.update({
    where: { 
      id: metadata.contractId 
    },
    data: {
      originalS3Key: payload.s3Key,
    },
  })
}