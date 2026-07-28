import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/get-user-session";
import { getRooms } from "@/lib/actions/get-rooms";
import { checkHapioAvailability } from "@/lib/actions/check-availability";
import { RoomsPage } from "@/components/rooms/rooms-page";

interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/register");
  }

  const { date } = await searchParams;

  const rooms = await getRooms();

  let availabilityData = null;
  if (date) {
    availabilityData = await checkHapioAvailability(date);
  }

  return (
    <Suspense fallback={null}>
      <RoomsPage
        rooms={rooms}
        availability={availabilityData}
        selectedDate={date}
      />
    </Suspense>
  );
}