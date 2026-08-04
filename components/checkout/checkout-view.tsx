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

  // Get the Stripe URL we generated during the booking action
  const stripeSession = await stripe.checkout.sessions.retrieve(
    booking.stripeCheckoutSessionId!
  );

  return (
    <main className="min-h-screen bg-zinc-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          Review your booking
        </h1>
        
        {/* Pass necessary data down to the interactive client component */}
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