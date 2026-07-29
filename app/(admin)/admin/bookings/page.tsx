import { getAllBookings } from "@/lib/actions/get-all-bookings";
import AdminBookingPage from "@/components/admin/booking/admin-booking-page";

export default async function Page() {
  const bookings = await getAllBookings();

  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <AdminBookingPage bookings={bookings} />
    </div>
  );
}
