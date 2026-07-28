"use client";

// Use 'import type' so the server action isn't bundled into the client
import type { getBooking } from "@/lib/actions/get-booking";

// 1. Awaited unwraps the Promise
// 2. NonNullable removes the 'null' possibility (since you check it in the server component)
// 3. ReturnType<typeof getBooking> infers the exact Prisma payload
type BookingProp = NonNullable<Awaited<ReturnType<typeof getBooking>>>;

export function BookingIdPage({ booking }: { booking: BookingProp }) {
  return (
    <div>
      {/* You now have fully typed access to booking.room, booking.thread, booking.user */}
      <h1>Booking: {booking.id}</h1>
    </div>
  );
}
