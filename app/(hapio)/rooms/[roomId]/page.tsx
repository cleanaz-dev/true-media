import { RoomDetailsPage } from "@/components/rooms/room-details-page"
import { getRoomDetailsById } from "@/lib/actions/get-room-details-by-id"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{ roomId: string }>;
}

export default async function Page({ params }: PageProps) {
    const { roomId } = await params;

    if (!roomId) return notFound();

    // Just get the DB details. No Hapio logic here anymore!
    const roomDetails = await getRoomDetailsById(roomId);
    if (!roomDetails) return notFound(); 

    return (
        <RoomDetailsPage roomDetails={roomDetails} />
    );
}