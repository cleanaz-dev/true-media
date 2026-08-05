"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { cancelPendingBooking } from "@/lib/actions/cancel-booking";

interface CheckoutTimerProps {
  bookingId: string;
  tempHold: Date;
  roomName: string;
  roomId: string;
  date: Date;
  stripeUrl: string;
}

export function CheckoutTimer({
  bookingId,
  tempHold,
  roomName,
  roomId,
  date,
  stripeUrl,
}: CheckoutTimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const holdTime = new Date(tempHold).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = holdTime - now;

      if (difference <= 0) {
        clearInterval(interval);
        setIsExpired(true);
        setTimeLeft(0);
      } else {
        setTimeLeft(Math.floor(difference / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tempHold]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  const handleCancel = async () => {
    setIsCancelling(true);
    await cancelPendingBooking(bookingId);
    router.push(`/rooms/${roomId}`);
  };

  return (
    // Removed the nested border, shadow, and p-6 so it expands fully in the parent card
    <div className="w-full">
      {/* Timer Banner */}
      <div
        className={`mb-8 flex flex-col items-center justify-center gap-2 rounded-xl p-6 shadow-sm transition-colors ${
          isExpired 
            ? "bg-red-600 text-white" 
            : "bg-blue-600 text-white"
        }`}
      >
        <div className="flex items-center text-sm font-medium uppercase tracking-wider opacity-90">
          <Clock className="mr-2 h-4 w-4" />
          {isExpired ? "Hold Expired" : "Time left to complete"}
        </div>
        <div className="tabular-nums text-4xl font-bold tracking-tight">
          {timeString}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="mb-8 space-y-4 rounded-xl border border-zinc-100 bg-zinc-50 p-6">
        <h3 className="text-lg font-bold text-zinc-900">{roomName}</h3>
        <div className="flex justify-between text-zinc-600">
          <span>Date</span>
          <span className="font-medium text-zinc-900">
            {new Date(date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric"
            })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        <a
          href={isExpired ? "#" : stripeUrl}
          className={`block w-full rounded-xl px-4 py-4 text-center font-bold text-white transition-colors ${
            isExpired
              ? "cursor-not-allowed bg-zinc-400"
              : "bg-black hover:bg-zinc-800"
          }`}
        >
          {isExpired ? "Time Expired" : "Proceed to Payment"}
        </a>

        <button
          onClick={handleCancel}
          disabled={isCancelling}
          className="w-full rounded-xl px-4 py-3 font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-red-600 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isCancelling ? "Cancelling..." : "Cancel & Change Times"}
        </button>
      </div>
    </div>
  );
}