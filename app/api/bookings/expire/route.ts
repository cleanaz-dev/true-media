// api/bookings/expire/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { cancelHapioBooking } from "@/lib/hapio";
import { Receiver } from "@upstash/qstash";

export async function POST(req: Request) {
  // 1. SECURITY: Verify QStash Signature
  const rawBody = await req.text();
  const signature = req.headers.get("upstash-signature");
  if (!signature) return new NextResponse("No sig", { status: 401 });

  const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
  });

  const isValid = await receiver.verify({ signature, body: rawBody });
  if (!isValid) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = JSON.parse(rawBody);
    const { bookingId, hapioBookingId, stripeSessionId } = body;
    if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    // 2. ATOMIC RACE FIX
    const updated = await prisma.booking.updateMany({
      where: { id: bookingId, status: "PENDING" },
      data: { status: "CANCELLED" },
    });

    if (updated.count === 0) return NextResponse.json({ message: "Already paid, skipping." });

    // 3. External Cleanup
    if (stripeSessionId) {
      try { await stripe.checkout.sessions.expire(stripeSessionId); } catch (e) { console.error(e); }
    }
    if (hapioBookingId) {
      try { await cancelHapioBooking(hapioBookingId); } catch (e) { console.error(e); }
    }

    return NextResponse.json({ message: "Expired." });
  } catch (error) {
    return NextResponse.json({ error: "Internal" }, { status: 500 });
  }
}
