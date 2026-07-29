// lib/actions/check-availability.ts
import { HAPIO_LOCATION_ID, HAPIO_SERVICE_ID } from "../hapio";

export async function checkHapioAvailability(date: string) {
    // Hapio's PHP backend strictly requires +00:00 instead of Z
    const from = `${date}T00:00:00+00:00`;
    const to = `${date}T23:59:59+00:00`;

    const query = new URLSearchParams({
        from,
        to,
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

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Hapio Error: ${err}`);
        }
        
        const hapioData = await res.json();
        const slots = hapioData.data || [];

        // Extract the unique hapioResourceIds that are available
        const availableSet = new Set<string>();
        
        slots.forEach((slot: any) => {
            slot.resources?.forEach((resource: any) => {
                availableSet.add(resource.id);
            });
        });

        return {
            data: slots,
            availableResourceIds: Array.from(availableSet),
        };
        
    } catch (error) {
        console.error("Failed to check general availability:", error);
        return { data: [], availableResourceIds: [] };
    }
}