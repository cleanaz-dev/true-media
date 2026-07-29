"use client"

import { useState } from "react"
import { Room } from "@/lib/generated/prisma/client"
import { Clock } from "lucide-react"

// Added rawStartsAt and rawEndsAt
interface TimeSlot {
    id: string;
    startTime: string; 
    endTime: string;   
    rawStartsAt: string; 
    rawEndsAt: string;   
}

interface RoomDetailsPageProps {
    roomDetails: Room;
    selectedDate?: string;
    availableSlots?: TimeSlot[]; 
}

export function RoomDetailsPage({ roomDetails, selectedDate, availableSlots = [] }: RoomDetailsPageProps) {
    // Store the whole slot so we have access to the raw ISO strings for checkout
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

    const handleCheckout = () => {
        if (!selectedSlot) return;
        
        // You now have exactly what you need to create a Hapio booking!
        console.log("Proceeding to checkout with:", {
            roomId: roomDetails.id,
            hapioResourceId: roomDetails.hapioResourceId,
            startsAt: selectedSlot.rawStartsAt,
            endsAt: selectedSlot.rawEndsAt
        });

        // e.g., router.push(`/checkout?roomId=${roomDetails.id}&startsAt=${selectedSlot.rawStartsAt}&endsAt=${selectedSlot.rawEndsAt}`)
    };

    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="mx-auto max-w-6xl px-6 py-12">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-zinc-900">{roomDetails.name}</h1>
                    <p className="mt-2 text-lg font-medium text-zinc-600">
                        ${(roomDetails.rate / 100).toFixed(2)} <span className="text-sm font-normal">/ hour</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    
                    {/* LEFT COLUMN: Images & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-zinc-100">
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

                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 mb-4">About this studio</h2>
                            <p className="text-zinc-600 leading-relaxed text-lg">
                                {(roomDetails.info as any)?.description || "Premium studio space equipped with industry standard gear. Perfect for your next session."}
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Booking Widget */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
                            <h3 className="text-xl font-bold text-zinc-900 mb-4">Book a session</h3>
                            
                            {selectedDate ? (
                                <div className="mb-6 rounded-lg bg-blue-50 border border-blue-100 p-4 text-sm">
                                    <span className="font-semibold text-blue-900 block mb-1">Selected Date</span>
                                    {/* Make sure we force UTC so the date doesn't jump backward a day based on local timezone */}
                                    <span className="text-blue-700">
                                        {new Date(selectedDate + "T12:00:00Z").toLocaleDateString(undefined, { 
                                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                                        })}
                                    </span>
                                </div>
                            ) : (
                                <div className="mb-6 p-4 rounded-lg bg-yellow-50 text-yellow-800 text-sm">
                                    Please go back and select a date to view available times.
                                </div>
                            )}

                            {/* HAPIO TIME SLOTS GRID */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-zinc-900 mb-3 flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Available Times
                                </h4>
                                
                                {availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot.id}
                                                onClick={() => setSelectedSlot(slot)}
                                                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                                                    selectedSlot?.id === slot.id 
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-blue-600 hover:text-blue-600'
                                                }`}
                                            >
                                                {slot.startTime} - {slot.endTime}
                                            </button>
                                        ))}
                                    </div>
                                ) : selectedDate ? (
                                    <div className="p-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 text-center text-sm text-zinc-500">
                                        No available time slots on this date.
                                    </div>
                                ) : null}
                            </div>

                            <button 
                                onClick={handleCheckout}
                                disabled={!selectedSlot}
                                className="w-full rounded-xl bg-black px-4 py-4 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {selectedSlot ? "Continue to Checkout" : "Select a time to book"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}