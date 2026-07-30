// lib/actions/create-checkout-session.ts
"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function createCheckoutSession(roomId: string, bookingId: string) {
  const room = await prisma.room.findUniqueOrThrow({ where: { id: roomId } });

  if (!room.stripePriceId) {
    throw new Error("Room has no Stripe price configured");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: room.stripePriceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${bookingId}?canceled=true`,
    metadata: { bookingId, roomId },
  });

  return { url: session.url };
}