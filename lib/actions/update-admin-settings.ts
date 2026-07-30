"use server";

import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

export async function updateAdminSettings(data: any) {
  // 1. You should verify the user is an ADMIN here using Better Auth!
  // const session = await auth();
  // if (session?.user.role !== "ADMIN") throw new Error("Unauthorized");

  // 2. Update the singleton global row
  await prisma.adminSettings.upsert({
    where: { id: "global" },
    update: {
      businessName: data.businessName,
      supportEmail: data.supportEmail,
      supportPhone: data.supportPhone,
      enableStripe: data.enableStripe,
      enableCash: data.enableCash,
      enableEtransfer: data.enableEtransfer,
      eTransferEmail: data.eTransferEmail,
      eTransferInstructions: data.eTransferInstructions,
    },
    create: {
      id: "global",
      businessName: data.businessName,
      // ... same fields here for safety fallback
    }
  });

  // 3. Clear Next.js cache so the page shows the updated data immediately
  revalidatePath("/admin/settings");
}