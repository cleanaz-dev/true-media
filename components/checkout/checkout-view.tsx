import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/get-user-session";
import { CheckoutTimer } from "./checkout-timer";

interface CheckoutViewProps {
  bookingId: string;
}

export async function CheckoutView({ bookingId }: CheckoutViewProps) {
  const session = await getCurrentUser();
  if (!session) redirect("/sign-in");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  if (!booking || booking.status !== "PENDING") {
    redirect(`/rooms/${booking?.roomId || ""}`);
  }

  // Get the Stripe session we generated during the booking action
  let stripeSession = await stripe.checkout.sessions.retrieve(
    booking.stripeCheckoutSessionId!
  );

  // REGENERATION: If session died (e.g. QStash failed, Stripe auto-expired after 24h)
  if (stripeSession.status === "expired" || !stripeSession.url) {
    // NOTE: You should store totalHours on your Booking model to do this perfectly.
    // Using 1 as fallback quantity here - UPDATE YOUR SCHEMA TO STORE totalHours.
    const newSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: booking.room.stripePriceId ?? undefined, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?canceled=true`,
      metadata: { bookingId: booking.id, userId: session.id },
    });
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeCheckoutSessionId: newSession.id },
    });
    stripeSession = newSession;
  }

  return (
    <main className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          Review your booking
        </h1>
        
        <CheckoutTimer 
          bookingId={booking.id}
          tempHold={booking.tempHold!}
          roomName={booking.room.name}
          roomId={booking.room.id}
          date={booking.date}
          stripeUrl={stripeSession.url!} 
        />
      </div>
    </main>
  );
}

