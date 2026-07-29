"use client";

import Link from "next/link";
import { SearchBar } from "./search-bar";
import { Room } from "@/lib/generated/prisma/client";
import { ImageIcon, CheckCircle2, XCircle } from "lucide-react";
import { useHapio } from "@/context/hapio-contex"; // Make sure this path matches your project!

interface RoomsPageProps {
  rooms: Room[];
}

// --- SKELETON COMPONENT ---
function RoomSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      <div className="h-56 w-full bg-gray-200" />
      <div className="p-6 flex flex-col flex-grow">
        <div className="h-6 w-2/3 bg-gray-200 rounded-md mb-4" />
        <div className="space-y-2 mb-6 flex-grow">
          <div className="h-4 w-full bg-gray-100 rounded-md" />
          <div className="h-4 w-5/6 bg-gray-100 rounded-md" />
          <div className="h-4 w-4/6 bg-gray-100 rounded-md" />
        </div>
        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="h-3 w-10 bg-gray-200 rounded-md mb-2" />
            <div className="h-7 w-20 bg-gray-200 rounded-md" />
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function RoomsPage({ rooms }: RoomsPageProps) {
  const { selectedDate, isAvailable, isLoading } = useHapio();

  return (
    <div className="w-full pb-24 bg-gray-50 min-h-screen">
      {/* --- HERO SECTION --- */}
      <div className="relative w-full h-[30vh] min-h-[300px] flex flex-col items-center justify-center">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-image-02.jpg')" }}
        />
        <div className="absolute inset-0 z-0 bg-blue-950/75 mix-blend-multiply" />

        <div className="relative z-10 text-center px-4 mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            Find Your Perfect Space
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium drop-shadow-sm">
            Select a date below to check availability and secure your booking instantly.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-10 mb-16">
          <SearchBar />
        </div>

        {/* --- ROOMS GRID --- */}
        {rooms.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No rooms found in our system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Show skeletons if fetching data */}
            {isLoading
              ? Array.from({ length: rooms.length || 3 }).map((_, i) => (
                  <RoomSkeleton key={i} />
                ))
              : /* Otherwise render the actual rooms */
                rooms.map((room) => {
                  const available = isAvailable(room.hapioResourceId);
                  const showBadge = !!selectedDate;

                  return (
                    <div
                      key={room.id}
                      className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all duration-300 ${
                        selectedDate && !available
                          ? "opacity-60 grayscale-[50%]"
                          : "hover:shadow-xl hover:-translate-y-1"
                      }`}
                    >
                      {/* Card Cover Image */}
                      <div className="h-56 w-full bg-gray-100 relative group overflow-hidden">
                        {room.coverImageUrl ? (
                          <img
                            src={room.coverImageUrl}
                            alt={room.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <ImageIcon className="h-10 w-10 mb-2 opacity-40" />
                            <span className="text-sm font-medium">No Image</span>
                          </div>
                        )}

                        {/* Floating Availability Badge */}
                        {showBadge && (
                          <div
                            className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-lg backdrop-blur-md ${
                              available
                                ? "bg-green-500/95 text-white"
                                : "bg-red-500/95 text-white"
                            }`}
                          >
                            {available ? (
                              <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Available</>
                            ) : (
                              <><XCircle className="w-3.5 h-3.5 mr-1" /> Unavailable</>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Details */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {room.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 flex-grow leading-relaxed">
                          {room.description ||
                            "A beautiful, well-equipped room ready for your next stay. Features modern amenities and comfortable furnishings."}
                        </p>

                        {/* Bottom Action Row */}
                        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Price
                            </span>
                            <span className="text-2xl font-black text-gray-900">
                              ${room.stripePrice}
                              <span className="text-sm font-medium text-gray-500">
                                /hr
                              </span>
                            </span>
                          </div>

                          {/* Interactive Button */}
                          {!selectedDate ? (
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                              Select date
                            </span>
                          ) : available ? (
                            <Link
                              href={`/rooms/${room.id}?date=${selectedDate}`}
                              className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
                            >
                              Book Now
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="bg-gray-100 text-gray-400 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed"
                            >
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
    </div>
  );
}