import { RoomDetailsPage } from "@/components/rooms/room-details-page"
import { getRoomDetailsById } from "@/lib/actions/get-room-details-by-id"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
        roomId: string
    }>;
    searchParams: Promise<{
        date?: string
    }>;
}

export default async function Page({ params, searchParams }: PageProps) {
    // Await both params and searchParams (Next.js 15 requirement)
    const { roomId } = await params;
    const { date } = await searchParams; 

    if (!roomId) return notFound();

    const roomDetails = await getRoomDetailsById(roomId);
    
    if (!roomDetails) return notFound(); // Safety check in case they put a fake ID

    // Pass the date string directly down, no need for the hook here!
    return <RoomDetailsPage roomDetails={roomDetails} selectedDate={date} />
}