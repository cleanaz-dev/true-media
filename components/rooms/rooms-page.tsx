"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { useMemo } from "react";
import { Room } from "@/lib/generated/prisma/client";



interface RoomsPageProps {
  rooms: Room[];
  availability: any | null;
  selectedDate?: string;
}

export function RoomsPage({ rooms, availability, selectedDate }: RoomsPageProps) {
  // Extract available resource IDs from Hapio response
  const availableResourceIds = useMemo(() => {
    if (!availability) return new Set<string>();
    
    const ids = new Set<string>();
    
    // --- IMPORTANT ---
    // Adjust this logic based on your ACTUAL Hapio API response structure.
    // Example: if Hapio returns an array of available resources:
    // availability.forEach((item: any) => ids.add(item.resource_id));
    
    return ids;
  }, [availability]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Our Rooms</h1>
        <p className="text-gray-500 mt-1">Pick a date to ensure your room is available.</p>
      </div>

      {/* Search Bar triggers URL update -> Server refetches -> Re-renders */}
      <div className="mb-10">
        <SearchBar />
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <p className="text-gray-500">No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => {
            // If a date is selected, check against Hapio data
            const isAvailable = !selectedDate || availableResourceIds.has(room.hapioResourceId);

            return (
              <div 
                key={room.id} 
                className={`border rounded-xl overflow-hidden shadow-sm flex flex-col transition-all ${
                  selectedDate && !isAvailable ? 'opacity-50 grayscale' : 'hover:shadow-md'
                }`}
              >
                <div className="h-48 w-full bg-gray-200 relative">
                  {room.coverImageUrl ? (
                    <img src={room.coverImageUrl} alt={room.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  
                  {selectedDate && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                      isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {isAvailable ? "Available" : "Unavailable"}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-gray-900">{room.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2 flex-grow">
                    {room.description || "Beautiful room ready for your stay."}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-900">
                      ${room.stripePrice}
                      <span className="text-sm font-normal text-gray-500">/hour</span>
                    </span>
                    
                    {/* Logic for the Button/Link */}
                    {!selectedDate ? (
                      <span className="text-sm text-gray-400">Select a date</span>
                    ) : isAvailable ? (
                      <Link 
                        href={`/rooms/${room.id}?date=${selectedDate}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                      </Link>
                    ) : (
                      <button disabled className="bg-gray-200 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

