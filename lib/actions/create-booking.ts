// lib/actions/create-booking.ts
"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { Client as QStashClient } from "@upstash/qstash";
import { createHapioBooking, cancelHapioBooking } from "@/lib/hapio";
import { getCurrentUser } from "./get-user-session";
import { redirect } from "next/navigation";

const qstash = new QStashClient({ token: process.env.QSTASH_TOKEN! });

interface CreateBookingInput {
  roomId: string;
  startsAt: string; // ISO string
  endsAt: string;   // ISO string
}

export async function createBooking(input: CreateBookingInput) {
  const session = await getCurrentUser()
  if(!session) {
    redirect("/sign-in")
  }

  const room = await prisma.room.findUniqueOrThrow({ where: { id: input.roomId } });
  if (!room.stripePriceId) {
    throw new Error("Room has no Stripe price configured");
  }

  // 1. Create temporary Hapio hold
  const hapioBooking = await createHapioBooking({
    resourceId: room.hapioResourceId,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    isTemporary: true,
  });

  try {
    // 2. Create local Booking row
    const tempHold = new Date(Date.now() + 15 * 60 * 1000);

    const booking = await prisma.booking.create({
      data: {
        hapioBookingId: hapioBooking.id,
        roomId: room.id,
        userId: session.id,
        date: new Date(input.startsAt),
        status: "PENDING",
        tempHold,
      },
    });

    try {
      // 3. Create Stripe Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: room.stripePriceId, quantity: 1 }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?canceled=true`,
        metadata: { bookingId: booking.id, userId: session.id },
      });

      // 4. Store the session id, needed by the expiry job
      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeCheckoutSessionId: checkoutSession.id },
      });

      // 5. Schedule the expiry job
      await qstash.publishJSON({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/expire`,
        body: { bookingId: booking.id },
        delay: "15m",
      });

      return { url: checkoutSession.url };
    } catch (err) {
      await prisma.booking.delete({ where: { id: booking.id } });
      throw err;
    }
  } catch (err) {
    await cancelHapioBooking(hapioBooking.id);
    throw err;
  }
}