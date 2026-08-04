// @/lib/stripe/index.ts
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Booking, Room } from "@/lib/generated/prisma/client";

// 1. Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-06-24.dahlia",
  typescript: true,
});


// 2. Stripe Helper Services
type BookingWithRoom = Booking & { room: Room };

export async function getOrCreateCheckoutSession(
  booking: BookingWithRoom,
  userId: string
): Promise<string> {
  // If a session already exists, check if it's still valid
  if (booking.stripeCheckoutSessionId) {
    const existingSession = await stripe.checkout.sessions.retrieve(
      booking.stripeCheckoutSessionId
    );

    // If it's still open and valid, just return the existing URL
    if (existingSession.status === "open" && existingSession.url) {
      return existingSession.url;
    }
  }

  // If we reach here, we need a NEW session 
  // (either it never existed, expired, or was missing a URL)
  const newSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      { 
        price: booking.room.stripePriceId ?? undefined, 
        quantity: booking.totalHours 
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${booking.id}?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/${booking.id}?canceled=true`,
    metadata: { bookingId: booking.id, userId },
  });

  // Update the database with the new session ID
  await prisma.booking.update({
    where: { id: booking.id },
    data: { stripeCheckoutSessionId: newSession.id },
  });

  return newSession.url!;
}