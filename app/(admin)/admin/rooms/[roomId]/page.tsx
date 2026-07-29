import { SingleRoomAdminPage } from "@/components/admin/room/single-room-admin-page";
import { getRoomById } from "@/lib/actions/get-room-by-id";
import { notFound } from "next/navigation";

interface Params {
  params: Promise<{
    roomId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { roomId } = await params;

  const room = await getRoomById(roomId)

  if(!room) return notFound()

    return <SingleRoomAdminPage room={room} />
}
