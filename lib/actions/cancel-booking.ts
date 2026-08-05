// lib/actions/cancel-booking.ts
"use server";

import { prisma } from "@/lib/prisma";
import { cancelHapioBooking } from "@/lib/hapio";
import { stripe } from "@/lib/stripe";

export async function cancelPendingBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.status !== "PENDING") return;

  // 1. Cancel Hapio Hold
  try { 
    await cancelHapioBooking(booking.hapioBookingId); 
  } catch (e) {
    console.error("Failed to cancel Hapio hold", e);
  }

  // 2. Expire Stripe Session
  if (booking.stripeCheckoutSessionId) {
    try { 
      await stripe.checkout.sessions.expire(booking.stripeCheckoutSessionId); 
    } catch (e) {
      console.error("Failed to expire Stripe session", e);
    }
  }

  // 3. CHANGED: Delete the pending booking entirely instead of marking it CANCELLED
  await prisma.booking.delete({
    where: { id: bookingId }
  });
}