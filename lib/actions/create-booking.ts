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
  startsAt: string; 
  endsAt: string;   
  totalHours: number;
}

export async function createBooking(input: CreateBookingInput) {
  const session = await getCurrentUser()
  if(!session) redirect("/sign-in")

  const room = await prisma.room.findUniqueOrThrow({ where: { id: input.roomId } });
  if (!room.stripePriceId) throw new Error("Room has no Stripe price configured");

  const hapioBooking = await createHapioBooking({
    resourceId: room.hapioResourceId,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    isTemporary: true,
  });

  try {
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
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: room.stripePriceId, quantity: input.totalHours }],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?canceled=true`,
        metadata: { bookingId: booking.id, userId: session.id },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { stripeCheckoutSessionId: checkoutSession.id },
      });

      await qstash.publishJSON({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings/expire`,
        body: { bookingId: booking.id, hapioBookingId: hapioBooking.id, stripeSessionId: checkoutSession.id },
        delay: "15m",
      });

      // CHANGED: Return bookingId for hybrid routing
      return { bookingId: booking.id };
    } catch (err) {
      await prisma.booking.delete({ where: { id: booking.id } });
      throw err;
    }
  } catch (err) {
    await cancelHapioBooking(hapioBooking.id);
    throw err;
  }
}

