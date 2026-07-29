"use client";

import { CalendarCheck } from "lucide-react";
import { AdminPageHeader } from "../admin/admin-page-header";
export default function BookingsPage() {
  return (
    <main>
      <AdminPageHeader
        description="Manage all your room bookings."
        icon={CalendarCheck}
        action={{
          label: "New Booking",
          onClick: () => console.log("open modal"),
        }}
      />
    </main>
  );
}