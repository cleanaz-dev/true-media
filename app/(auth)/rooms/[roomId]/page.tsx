import { RoomDetailsPage } from "@/components/rooms/room-details-page"
import { getRoomDetailsById } from "@/lib/actions/get-room-details-by-id"
import { notFound } from "next/navigation"
import { HAPIO_LOCATION_ID, HAPIO_SERVICE_ID } from "@/lib/hapio" // Adjust path if needed!

interface PageProps {
    params: Promise<{
        roomId: string
    }>;
    searchParams: Promise<{
        date?: string
    }>;
}

// Safe helper to extract time from Hapio's ISO string (e.g. "2023-08-28T14:30:00+02:00" -> "2:30 PM")
// This avoids server vs browser timezone mismatch issues
function formatHapioTime(isoString: string) {
    const timePart = isoString.split('T')[1].substring(0, 5);
    const [hours, minutes] = timePart.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
}

export default async function Page({ params, searchParams }: PageProps) {
    const { roomId } = await params;
    const { date } = await searchParams; 

    if (!roomId) return notFound();

    const roomDetails = await getRoomDetailsById(roomId);
    if (!roomDetails) return notFound(); 

    let availableSlots = [];

    // If a date is selected, fetch this specific room's available times from Hapio
    if (date && roomDetails.hapioResourceId) {
        const from = `${date}T00:00:00+00:00`;
        const to = `${date}T23:59:59+00:00`;
        
        const query = new URLSearchParams({
            from,
            to,
            location: HAPIO_LOCATION_ID,
        });

        const res = await fetch(`https://eu-central-1.hapio.net/v1/services/${HAPIO_SERVICE_ID}/bookable-slots?${query.toString()}`, {
            headers: {
                Authorization: `Bearer ${process.env.HAPIO_KEY}`,
                "Content-Type": "application/json",
            },
            cache: 'no-store'
        });

        if (res.ok) {
            const hapioData = await res.json();
            const allSlots = hapioData.data || [];
            
            // 1. Filter out slots that don't belong to this specific room
            const roomSlots = allSlots.filter((slot: any) => 
                slot.resources.some((r: any) => r.id === roomDetails.hapioResourceId)
            );

            // 2. Map them into the format our Client Component needs
            availableSlots = roomSlots.map((slot: any) => ({
                id: slot.starts_at, 
                startTime: formatHapioTime(slot.starts_at),
                endTime: formatHapioTime(slot.ends_at),
                rawStartsAt: slot.starts_at, // Keep this for checkout!
                rawEndsAt: slot.ends_at      // Keep this for checkout!
            }));
        }
    }

    return (
        <RoomDetailsPage 
            roomDetails={roomDetails} 
            selectedDate={date} 
            availableSlots={availableSlots} 
        />
    );
}