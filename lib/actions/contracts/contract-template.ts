"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadFilePrivate } from "@/lib/aws/s3";
import { randomUUID } from "crypto";
import { PDFParse } from "pdf-parse";

export interface CreateContractTemplateInput {
  name: string;
  description?: string;
  body?: string;
  s3Key?: string;
  isActive?: boolean;
}

export async function createContractTemplateAction(data: CreateContractTemplateInput) {
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
    return { success: false, error: error instanceof Error ? error.message : "Failed to create template" };
  }
}

export async function uploadContractTemplateFileAction(file: File) {
  try {
    if (!file) return { success: false, error: "No file provided." };
    if (file.type !== "application/pdf") return { success: false, error: "Only PDF files are supported." };

    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedText = "";
    try {
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      extractedText = result.text.trim();
      await parser.destroy(); 
    } catch (err) {
      console.error("pdf-parse failed:", err);
    }

    const needsOcr = extractedText.length < 50;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `contract-templates/${randomUUID()}-${safeName}`;
    
    await uploadFilePrivate(key, buffer, file.type);

    return {
      success: true,
      s3Key: key,
      extractedText: needsOcr ? undefined : extractedText,
      needsOcr,
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to upload file" };
  }
}