// app/(hapio)/checkout/[bookingId]/page.tsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/get-user-session";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { getOrCreateCheckoutSession } from "@/lib/stripe";

interface PageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function CheckoutPage({ params }: PageProps) {
  const { bookingId } = await params;
  const session = await getCurrentUser();
  
  if (!session) {
    redirect("/sign-in");
  }

  // 1. Fetch data
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { room: true },
  });

  // Validate state
  if (!booking || booking.status !== "PENDING") {
    redirect(`/rooms/${booking?.roomId || ""}`);
  }

  // 2. Delegate complex business logic to our service
  const stripeUrl = await getOrCreateCheckoutSession(booking, session.id);

  // 3. Render pure UI
  return (
    <CheckoutView 
      booking={booking}
      room={booking.room}
      stripeUrl={stripeUrl} 
    />
  );
}