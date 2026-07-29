import { getBooking } from "@/lib/actions/get-booking";

type Booking = Awaited<ReturnType<typeof getBooking>>;

interface BookingIdPageProps {
  booking: NonNullable<Booking>;
}

export function BookingIdPage({ booking }: BookingIdPageProps) {
  return (
    <main>
        Booking: {booking.id}
    </main>
  )
}
