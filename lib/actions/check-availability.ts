// lib/actions/check-availability.ts
import { prisma } from "../prisma";

export async function checkHapioAvailability(date: string) {
    // 1. Get all your room IDs from Prisma
    const rooms = await prisma.room.findMany({
        select: { id: true, hapioResourceId: true }
    });

    // 2. Prepare the payload for Hapio's availability endpoint
    // (Assuming Hapio v1 /availability API where you pass resource IDs and a time range)
    const startTime = `${date}T00:00:00Z`;
    const endTime = `${date}T23:59:59Z`;

    try {
        const response = await fetch('https://api.hapio.net/v1/availability', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.HAPIO_API_KEY}`
            },
            body: JSON.stringify({
                resources: rooms.map(r => r.hapioResourceId),
                starts_at: startTime,
                ends_at: endTime,
            })
        });

        const hapioData = await response.json();
        
        // This will return the Hapio slots. You can process this to see 
        // which hapioResourceIds have open slots and return them.
        return hapioData; 
    } catch (error) {
        console.error("Hapio fetch failed:", error);
        return null;
    }
}