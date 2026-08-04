// app/api/webhooks/stripe/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { confirmHapioBooking, cancelHapioBooking } from "@/lib/hapio";
import { sendEmail } from "@/lib/email/send-email";
import { BookingConfirmationEmail } from "@/lib/email/booking-confirmation-email";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    const userId = session.metadata?.userId;

    if (bookingId && userId) {
      // INCLUDE user and room so we have the data for the email
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { user: true, room: true },
      });

      if (booking && booking.status === "PENDING") {
        // 1. CONFIRM HAPIO FIRST. If it throws, return 500 so Stripe retries later.
        try {
          await confirmHapioBooking(booking.hapioBookingId);
        } catch (e) {
          console.error("Hapio confirm failed", e);
          return new NextResponse("Hapio failed", { status: 500 });
        }

        // 2. UPDATE DB (clear tempHold)
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "BOOKED", paymentState: "PAID", tempHold: null },
        });

        // 3. LOG TRANSACTION
        await prisma.transaction.create({
          data: {
            amount: session.amount_total || 0,
            currency: session.currency || "cad",
            provider: "STRIPE",
            status: "SUCCEEDED",
            externalId: session.payment_intent as string,
            bookingId: booking.id,
            userId: userId,
          },
        });

        // 4. SEND CONFIRMATION EMAIL
        // Wrap in a try/catch so if Resend is down, we don't return 500 and
        // cause Stripe to retry the webhook (which would try to confirm Hapio again)
        try {
          await sendEmail({
            to: booking.user.email,
            // Make sure this matches the domain you verified in Resend!
            from: "bookings@yourdomain.com",
            subject: `Booking Confirmed: ${booking.room.name}`,
            template: BookingConfirmationEmail({
              user: booking.user,
              booking,
              room: booking.room,
            }),
            userId: booking.userId,
            templateSlug: "booking-confirmation",
          });
        } catch (e) {
          console.error("Failed to send confirmation email", e);
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });
      if (booking && booking.status === "PENDING") {
        // Cancel Hapio here too in case QStash died
        try {
          await cancelHapioBooking(booking.hapioBookingId);
        } catch (e) {
          console.error(e);
        }
        await prisma.booking.updateMany({
          where: { id: bookingId, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}
