"use client";

import { CalendarCheck } from "lucide-react";
import { AdminPageHeader } from "../admin-page-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllBookings } from "@/lib/actions/get-all-bookings";
import { AdminBookingTable } from "./admin-booking-table";

// One booking item = one element from the array returned by getAllBookings
export type BookingWithRelations = Awaited<
  ReturnType<typeof getAllBookings>
>[number];

interface AdminBookingPageProps {
  bookings: BookingWithRelations[];
}

export default function AdminBookingPage({ bookings }: AdminBookingPageProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-8">
        <AdminPageHeader
          description="Manage all your room bookings."
          icon={CalendarCheck}
          action={{
            label: "New Booking",
            onClick: () => console.log("open modal"),
          }}
        />
      </div>

      <ScrollArea className="flex-1 px-8 pb-8">
        <AdminBookingTable bookings={bookings} />
      </ScrollArea>
    </div>
  );
}
