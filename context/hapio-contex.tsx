"use client";

import { createContext, useContext, ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

type AvailabilityData = {
  data: any[];
  availableResourceIds: string[];
} | null;

interface HapioContextValue {
  availability: AvailabilityData;
  selectedDate?: string;
  isAvailable: (hapioResourceId: string) => boolean;
  isLoading: boolean;
}

const HapioContext = createContext<HapioContextValue | null>(null);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function HapioProvider({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date") ?? undefined;

  const { data: availability, isLoading } = useSWR<AvailabilityData>(
    selectedDate ? `/api/availability?date=${selectedDate}` : null,
    fetcher
  );

  const availableSet = new Set(availability?.availableResourceIds ?? []);
  const isAvailable = (hapioResourceId: string) => {
    if (!selectedDate) return true;
    return availableSet.has(hapioResourceId);
  };

  return (
    <HapioContext.Provider
      value={{ availability: availability ?? null, selectedDate, isAvailable, isLoading }}
    >
      {children}
    </HapioContext.Provider>
  );
}

export function useHapio() {
  const ctx = useContext(HapioContext);
  if (!ctx) throw new Error("useHapio must be used within a HapioProvider");
  return ctx;
}