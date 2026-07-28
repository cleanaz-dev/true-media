import { getBooking } from "@/lib/actions/get-booking";
import { getCurrentUser } from "../auth";

// Slick access handler: checks public status OR ownership
export async function getAccessibleBooking(bookingId: string) {
  const booking = await getBooking(bookingId);

  if (!booking) return null;

  // 1. Public bookings are accessible by anyone
  if (booking.isPublic) return booking;

  // 2. Private bookings require identity verification
  const user = await getCurrentUser();

  // If logged in AND the user owns the booking, return it
  if (user && user.id === booking.userId) {
    return booking;
  }

  // Otherwise, access denied
  return null;
}
