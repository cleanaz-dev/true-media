"use server";

import { prisma } from "@/lib/prisma";
import { cancelHapioBooking } from "@/lib/hapio";
import { stripe } from "@/lib/stripe";

export async function cancelPendingBooking(bookingId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking || booking.status !== "PENDING") return;

  // 1. Cancel Hapio Hold
  try { await cancelHapioBooking(booking.hapioBookingId); } catch (e) {}

  // 2. Expire Stripe Session
  if (booking.stripeCheckoutSessionId) {
    try { await stripe.checkout.sessions.expire(booking.stripeCheckoutSessionId); } catch (e) {}
  }

  // 3. Mark cancelled in DB
  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" }
  });
}