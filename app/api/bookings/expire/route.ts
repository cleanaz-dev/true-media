import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { cancelHapioBooking } from "@/lib/hapio"; // Adjust path if needed

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, hapioBookingId, stripeSessionId } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    // 1. Get the booking
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // 2. If it's already BOOKED or PAID, we do nothing! They bought it in time.
    if (booking.status !== "PENDING" || booking.paymentState === "PAID") {
      return NextResponse.json({ message: "Booking already handled, skipping expiry." });
    }

    // 3. If it's STILL pending after 15 mins, cancel it all
    // A. Expire the Stripe Session so they can't pay anymore
    if (stripeSessionId) {
      try {
        await stripe.checkout.sessions.expire(stripeSessionId);
      } catch (e) {
        console.error("Stripe session might already be expired", e);
      }
    }

    // B. Cancel the hold in Hapio to free up the slot for others
    if (hapioBookingId) {
      try {
        await cancelHapioBooking(hapioBookingId);
      } catch (e) {
        console.error("Failed to cancel Hapio booking, it might already be gone", e);
      }
    }

    // C. Update your database to CANCELLED
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" }, 
    });

    return NextResponse.json({ message: "Booking expired successfully." });
  } catch (error) {
    console.error("Expiry error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}