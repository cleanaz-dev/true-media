"use client";

import { useState } from "react";
import { Room } from "@/lib/generated/prisma/client";
import { Clock } from "lucide-react";
import { useHapio } from "@/context/hapio-contex";
import { useRoomInfo } from "@/hooks/use-room-info";
import { RoomFeatures } from "@/components/rooms/room-features";
import {
  TimeSlotPicker,
  type TimeSlot,
} from "@/components/rooms/time-slot-picker";
import { createBooking } from "@/lib/actions/create-booking";
import { useRouter } from "next/navigation";

interface RoomDetailsPageProps {
  roomDetails: Room;
}

export function RoomDetailsPage({ roomDetails }: RoomDetailsPageProps) {
  const { selectedDate, getRoomSlots, isLoading } = useHapio();
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();

  const { features } = useRoomInfo(roomDetails.info);
  const availableSlots: TimeSlot[] = getRoomSlots(roomDetails.hapioResourceId);

  const handleCheckout = async () => {
    if (selectedSlots.length === 0) return;
    setIsCheckingOut(true);

    try {
      const sortedSlots = [...selectedSlots].sort(
        (a, b) =>
          new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime(),
      );

      const response = await createBooking({
        roomId: roomDetails.id,
        startsAt: sortedSlots[0].rawStartsAt,
        endsAt: sortedSlots[sortedSlots.length - 1].rawEndsAt,
        totalHours: sortedSlots.length,
      });

      // CHANGED: Route to Hybrid Checkout Page instead of Stripe directly
      if (response.bookingId) {
        router.push(`/checkout/${response.bookingId}`);
      }
    } catch (error) {
      console.error("Failed to start checkout:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };
  return (
    <main className="min-h-screen bg-white pb-20">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900">
            {roomDetails.name}
          </h1>
          <p className="mt-2 text-lg font-medium text-zinc-600">
            ${(roomDetails.rate).toFixed(2)}{" "}
            <span className="text-sm font-normal">/ hour</span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
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
              <h2 className="mb-4 text-2xl font-bold text-zinc-900">
                About this studio
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-zinc-600">
                {roomDetails.description ||
                  "Premium studio space equipped with industry standard gear. Perfect for your next session."}
              </p>
              <RoomFeatures features={features} variant="booking" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-xl font-bold text-zinc-900">
                Book a session
              </h3>

              {selectedDate ? (
                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm">
                  <span className="mb-1 block font-semibold text-blue-900">
                    Selected Date
                  </span>
                  <span className="text-blue-700">
                    {new Date(selectedDate + "T12:00:00Z").toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                </div>
              ) : (
                <div className="mb-6 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
                  Please go back and select a date to view available times.
                </div>
              )}

              <div className="mb-6">
                <h4 className="mb-3 flex items-center text-sm font-bold text-zinc-900">
                  <Clock className="mr-2 h-4 w-4" />
                  Available Times
                </h4>

                <TimeSlotPicker
                  slots={availableSlots}
                  selectedSlots={selectedSlots}
                  onChange={setSelectedSlots}
                  isLoading={isLoading}
                  selectedDate={selectedDate}
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedSlots.length === 0 || isCheckingOut}
                className="w-full cursor-pointer rounded-xl bg-black px-4 py-4 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {isCheckingOut
                  ? "Preparing checkout..."
                  : selectedSlots.length > 0
                    ? `Book ${selectedSlots.length} hour${selectedSlots.length > 1 ? "s" : ""}`
                    : "Select times to book"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
