import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/get-user-session";
import { getRooms } from "@/lib/actions/get-rooms";
import { RoomsPage } from "@/components/rooms/rooms-page";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const rooms = await getRooms();

  return <RoomsPage rooms={rooms} />;
}