// lib/actions/check-availability.ts
import { HAPIO_LOCATION_ID, HAPIO_SERVICE_ID } from "../hapio";

export async function checkHapioAvailability(date: string) {
    const query = new URLSearchParams({
        from: `${date}T00:00:00+00:00`,
        to: `${date}T23:59:59+00:00`,
        location: HAPIO_LOCATION_ID,
    });

    try {
        const res = await fetch(
            `https://eu-central-1.hapio.net/v1/services/${HAPIO_SERVICE_ID}/bookable-slots?${query.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HAPIO_KEY}`,
                    "Content-Type": "application/json",
                },
                cache: 'no-store' 
            }
        );

        if (!res.ok) throw new Error(`Hapio Error: ${await res.text()}`);
        
        const hapioData = await res.json();
        
        // Just return the raw array of slots
        return hapioData.data || []; 
        
    } catch (error) {
        console.error("Failed to check general availability:", error);
        return []; // Fail gracefully
    }
}