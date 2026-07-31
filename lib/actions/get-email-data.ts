// lib/actions/get-email-data.ts
import { prisma } from "../prisma";

export async function getEmailData() {
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });
  
  const logs = await prisma.emailLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Return flat object
  return { templates, logs };
}

// Export the exact return type for the frontend
export type EmailManagementData = Awaited<ReturnType<typeof getEmailData>>;
