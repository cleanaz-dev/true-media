import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { confirmHapioBooking } from "@/lib/hapio"; // Adjust path if needed
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // We stored these in the createBooking metadata!
    const bookingId = session.metadata?.bookingId;
    const userId = session.metadata?.userId;

    if (bookingId && userId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      
      if (booking && booking.status === "PENDING") {
        
        // 1. Update Booking to BOOKED and PAID
        await prisma.booking.update({
          where: { id: bookingId },
          data: { 
            status: "BOOKED",
            paymentState: "PAID"
          },
        });

        // 2. Create the Transaction record for your database
        await prisma.transaction.create({
          data: {
            amount: session.amount_total || 0,
            currency: session.currency || "cad",
            provider: "STRIPE",
            status: "SUCCEEDED",
            externalId: session.payment_intent as string,
            bookingId: booking.id,
            userId: userId,
          }
        });

        // 3. Lock it in with Hapio! (Removes the is_temporary flag)
        await confirmHapioBooking(booking.hapioBookingId);
      }
    }
  }

  // Handle if they manually cancel on the Stripe screen, or if it expires naturally via Stripe
  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      // If it's still pending, update DB (Hapio cancellation is handled by Qstash or can be done here too)
      if (booking && booking.status === "PENDING") {
         await prisma.booking.update({
           where: { id: bookingId },
           data: { status: "CANCELLED" }
         });
      }
    }
  }

  return new NextResponse(null, { status: 200 });
}