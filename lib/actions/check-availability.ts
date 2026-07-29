// lib/actions/check-availability.ts
import { HAPIO_LOCATION_ID, HAPIO_SERVICE_ID } from "../hapio";

export async function checkHapioAvailability(date: string) {
    // 1. Create the time window for the selected date
    // Note: If you need to respect a specific timezone, adjust the Z offset
    const from = `${date}T00:00:00Z`;
    const to = `${date}T23:59:59Z`;

    const query = new URLSearchParams({
        from,
        to,
        location: HAPIO_LOCATION_ID,
    });

    try {
        // 2. Fetch ALL bookable slots for this service and location in one go
        const res = await fetch(
            `https://eu-central-1.hapio.net/v1/services/${HAPIO_SERVICE_ID}/bookable-slots?${query.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.HAPIO_KEY}`,
                    "Content-Type": "application/json",
                },
                // Ensures Next.js doesn't aggressively cache the availability
                cache: 'no-store' 
            }
        );

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`Hapio Error: ${err}`);
        }
        
        const hapioData = await res.json();
        const slots = hapioData.data || [];

        // 3. Extract the unique hapioResourceIds that are available in any of the slots
        const availableSet = new Set<string>();
        
        slots.forEach((slot: any) => {
            slot.resources?.forEach((resource: any) => {
                availableSet.add(resource.id);
            });
        });

        // 4. Return exactly what your HapioProvider is waiting for!
        return {
            data: slots,
            availableResourceIds: Array.from(availableSet),
        };
        
    } catch (error) {
        console.error("Failed to check general availability:", error);
        // Safe fallback to prevent frontend crashes
        return { data: [], availableResourceIds: [] };
    }
}