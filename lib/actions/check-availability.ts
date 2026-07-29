import { prisma } from "../prisma";

export async function checkHapioAvailability(date: string) {
    // 1. Get all your room IDs from Prisma
    const rooms = await prisma.room.findMany({
        select: { id: true, hapioResourceId: true }
    });

    // 2. Prepare the time range parameters
    const startTime = `${date}T00:00:00Z`;
    const endTime = `${date}T23:59:59Z`;

    try {
        // 3. Fetch availability for all resources concurrently 
        const availabilityPromises = rooms.map(async (room) => {
            // URLSearchParams ensures your ISO strings are properly URL-encoded
            const params = new URLSearchParams({
                from: startTime,
                to: endTime
            });

            // Correct base URL and GET endpoint for resource schedules
            const url = `https://eu-central-1.hapio.net/v1/resources/${room.hapioResourceId}/schedule?${params.toString()}`;

            const response = await fetch(url, {
                method: 'GET', // GET request, no body allowed
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.HAPIO_KEY}`
                }
            });

            if (!response.ok) {
                console.error(`Failed to fetch schedule for resource ${room.hapioResourceId}`, await response.text());
                return { roomId: room.id, schedule: null };
            }

            const hapioData = await response.json();
            
            // Hapio usually returns data wrapped in a "data" array property
            return { roomId: room.id, schedule: hapioData.data }; 
        });

        // 4. Wait for all resource schedules to be fetched
        const results = await Promise.all(availabilityPromises);
        
        return results; 
    } catch (error) {
        console.error("Hapio fetch failed:", error);
        return null;
    }
}