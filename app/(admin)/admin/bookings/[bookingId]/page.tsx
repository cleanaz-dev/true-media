import { getAccessibleBooking } from "@/lib/actions/booking-access";
import { notFound } from "next/navigation";
import { BookingIdPage } from "@/components/booking/booking-id-page";

interface Params {
  params: Promise<{
    bookingId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { bookingId } = await params;
  const booking = await getAccessibleBooking(bookingId);

  if (!booking) return notFound();

  return <BookingIdPage booking={booking} />;
}
