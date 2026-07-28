// app/rooms/page.tsx
import { getRooms } from "@/lib/actions/get-rooms";
import { checkHapioAvailability } from "@/lib/actions/check-availability";
import { RoomsPage } from "@/components/rooms/rooms-page";

export default async function Page({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    // 1. Get base room info from Prisma
    const rooms = await getRooms();
    
    // 2. If they searched a date, ask Hapio who is available
    let availabilityData = null;
    if (searchParams.date) {
        availabilityData = await checkHapioAvailability(searchParams.date);
    }
    
    return <RoomsPage 
        rooms={rooms} 
        availability={availabilityData} 
        selectedDate={searchParams.date} 
    />;
}