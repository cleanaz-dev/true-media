"use client";

import { createContext, useContext, ReactNode, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

// Helper to extract time from Hapio's ISO string (e.g. "2023-08-28T14:30:00+02:00" -> "2:30 PM")
// You can also move this to a shared lib/utils.ts file later if needed!
function formatHapioTime(isoString: string) {
    if (!isoString) return "";
    const timePart = isoString.split('T')[1].substring(0, 5);
    const [hours, minutes] = timePart.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
}

interface HapioContextValue {
  slots: any[] | undefined;
  selectedDate?: string;
  isAvailable: (hapioResourceId: string) => boolean;
  getRoomSlots: (hapioResourceId: string) => any[];
  isLoading: boolean;
}

const HapioContext = createContext<HapioContextValue | null>(null);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function HapioProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date") ?? undefined;

  // We now expect just a raw array of slots from our simplified API
  const { data: slots, isLoading } = useSWR<any[]>(
    selectedDate ? `/api/availability?date=${selectedDate}` : null,
    fetcher
  );

  // Derive the available resource IDs on the client to avoid sending redundant data from the server
  const availableSet = useMemo(() => {
    const set = new Set<string>();
    if (slots) {
        slots.forEach((slot) => {
            slot.resources?.forEach((resource: any) => set.add(resource.id));
        });
    }
    return set;
  }, [slots]);

  // Check if a specific resource has ANY availability on the selected date
  const isAvailable = useCallback((hapioResourceId: string) => {
    if (!selectedDate) return true; // Default to true if no date is picked yet
    return availableSet.has(hapioResourceId);
  }, [selectedDate, availableSet]);

  // Get and format the exact time slots for a specific resource
  const getRoomSlots = useCallback((hapioResourceId: string) => {
    if (!slots) return [];

    // Filter to slots that contain this specific resource ID
    const roomSlots = slots.filter((slot: any) => 
        slot.resources?.some((r: any) => r.id === hapioResourceId)
    );

    // Format them for the UI components to consume
    return roomSlots.map((slot: any) => ({
        id: slot.starts_at, 
        startTime: formatHapioTime(slot.starts_at),
        endTime: formatHapioTime(slot.ends_at),
        rawStartsAt: slot.starts_at, // Keep raw ISOs for the final Stripe checkout/booking payload
        rawEndsAt: slot.ends_at
    }));
  }, [slots]);

  return (
    <HapioContext.Provider
      value={{ 
        slots, 
        selectedDate, 
        isAvailable, 
        getRoomSlots, 
        isLoading 
      }}
    >
      {children}
    </HapioContext.Provider>
  );
}

// Custom hook to consume the context
export function useHapio() {
  const ctx = useContext(HapioContext);
  if (!ctx) {
    throw new Error("useHapio must be used within a HapioProvider");
  }
  return ctx;
}