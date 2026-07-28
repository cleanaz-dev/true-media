"use client"

import { Room } from "@/lib/generated/prisma/client"

interface RoomDetailsPageProps {
    roomDetails: Room; // Use your actual Prisma type here!
    selectedDate?: string;
}

export function RoomDetailsPage({ roomDetails, selectedDate }: RoomDetailsPageProps) {
    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="mx-auto max-w-6xl px-6 py-12">
                
                {/* 1. Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-zinc-900">{roomDetails.name}</h1>
                    <p className="mt-2 text-lg font-medium text-zinc-600">
                        ${(roomDetails.rate / 100).toFixed(2)} <span className="text-sm font-normal">/ hour</span>
                    </p>
                </div>

                {/* 2. Main Layout (Left: Info, Right: Booking Widget) */}
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    
                    {/* LEFT COLUMN: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Big Image */}
                        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-200">
                            {roomDetails.coverImageUrl ? (
                                <img 
                                    src={roomDetails.coverImageUrl} 
                                    alt={roomDetails.name} 
                                    className="h-full w-full object-cover" 
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-zinc-400">
                                    No cover image available
                                </div>
                            )}
                        </div>

                        {/* Info / Description */}
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4">About this studio</h2>
                            <p className="text-zinc-600 leading-relaxed text-lg">
                                {/* Assuming info is stored as JSON with a description property */}
                                {(roomDetails.info as any)?.description || "Premium studio space equipped with industry standard gear. Perfect for your next session."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Booking Widget (Hapio) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-zinc-900 mb-4">Book a session</h3>
                            
                            {selectedDate && (
                                <div className="mb-4 rounded-lg bg-zinc-100 p-3 text-sm">
                                    <span className="font-semibold text-zinc-700">Selected Date: </span>
                                    <span className="text-zinc-900">{selectedDate}</span>
                                </div>
                            )}

                            {/* THIS IS WHERE HAPIO GOES */}
                            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center text-zinc-500">
                                <p className="font-medium text-black mb-2">Hapio Time Slots</p>
                                <p className="text-sm">We will load the available hourly blocks here based on {selectedDate || "the date they pick"}.</p>
                            </div>

                            <button className="mt-6 w-full rounded-xl bg-black px-4 py-4 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50">
                                Continue to Checkout
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    )
}