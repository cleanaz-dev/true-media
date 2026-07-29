import { AdminRoomPage } from "@/components/admin/room/admin-rooms-page";
import { getAllRooms } from "@/lib/actions/get-all-rooms";

export default async function Page() {
  const rooms = await getAllRooms();
  return (
    <div className="h-full overflow-hidden rounded-xl bg-white shadow-sm">
      <AdminRoomPage rooms={rooms} />
    </div>
  );
}
