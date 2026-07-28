// 1. Import Suspense from React
import { Suspense } from "react";
import { getRooms } from "@/lib/actions/get-rooms";
import { checkHapioAvailability } from "@/lib/actions/check-availability";
import { RoomsPage } from "@/components/rooms/rooms-page";

export default async function Page({
    searchParams,
}: {
    searchParams: { date?: string };
}) {
    const rooms = await getRooms();
    
    let availabilityData = null;
    if (searchParams.date) {
        availabilityData = await checkHapioAvailability(searchParams.date);
    }
    
    // 2. Wrap the component in <Suspense>
    return (
        <Suspense fallback={null}>
            <RoomsPage 
                rooms={rooms} 
                availability={availabilityData} 
                selectedDate={searchParams.date} 
            />
        </Suspense>
    );
}
