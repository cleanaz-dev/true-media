// lib/handlers/handle-personalize-pdf.ts
import { prisma } from "@/lib/prisma"
import { z } from "zod"


export async function handlePersonalizePdf(
  systemTask: { id: string; metadata: unknown },
  data: unknown,
) {
    return
}