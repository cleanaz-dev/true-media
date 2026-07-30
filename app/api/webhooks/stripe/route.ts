// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Idempotency check
  const existing = await prisma.webhookEvent.findUnique({
    where: { eventId: event.id },
  });
  if (existing) {
    return NextResponse.json({ received: true });
  }

  await prisma.webhookEvent.create({
    data: {
      provider: "stripe",
      eventId: event.id,
      type: event.type,
      payload: event as any,
    },
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          data: { paymentState: "PAID", status: "BOOKED" },
        }),
        prisma.transaction.create({
          data: {
            amount: session.amount_total ?? 0,
            currency: session.currency ?? "cad",
            provider: "STRIPE",
            status: "SUCCEEDED",
            externalId: session.payment_intent as string,
            bookingId,
            userId: session.metadata?.userId ?? "",
          },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}