// lib/actions/contract/contract-templates.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface CreateContractTemplateInput {
  name: string;
  description?: string;
  body?: string;
  s3Key?: string;
  isActive?: boolean;
}

export async function createContractTemplateAction(
  data: CreateContractTemplateInput
) {
  try {
    if (!data.name || data.name.trim() === "") {
      return { success: false, error: "Template name is required." };
    }

    const template = await prisma.contractTemplate.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        body: data.body?.trim() || null,
        s3Key: data.s3Key?.trim() || null,
        isActive: data.isActive ?? true,
      },
    });

    revalidatePath("/admin/contracts");
    revalidatePath("/admin/templates");

    return { success: true, data: template };
  } catch (error) {
    console.error("Failed to create contract template:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create template",
    };
  }
}