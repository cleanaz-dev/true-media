"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRoom(roomId: string, data: any) {
  try {
    await prisma.room.update({
      where: { id: roomId },
      data: {
        name: data.name,
        description: data.description,
        rate: parseInt(data.rate),
        coverImageUrl: data.coverImageUrl || null,
        images: data.images, // Array of strings
        stripePriceId: data.stripePrice || null,
        info: data.info, // JSON object with amenities & capacity
      },
    });

    revalidatePath(`/admin/rooms`);
    revalidatePath(`/admin/rooms/${roomId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update room:", error);
    return { success: false, error: "Failed to update room in database." };
  }
}