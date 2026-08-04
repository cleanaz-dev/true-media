// components/checkout/checkout-view.tsx
import Image from "next/image";
import { format } from "date-fns";
import { CalendarDays, Clock, Users, ShieldCheck } from "lucide-react";
import { Booking, Room } from "@/lib/generated/prisma/client";
import { CheckoutTimer } from "./checkout-timer";

interface CheckoutViewProps {
  booking: Booking;
  room: Room;
  stripeUrl: string;
}

export function CheckoutView({ booking, room, stripeUrl }: CheckoutViewProps) {
  // Assuming 'rate' is stored in cents (Stripe standard). 
  // If you store it in full dollars, remove the `/ 100`
  const rateInDollars = room.rate / 100; 
  const totalAmount = rateInDollars * booking.totalHours;

  return (
    <main className="min-h-screen bg-zinc-50/50 py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Complete your booking
          </h1>
          <p className="mt-2 text-zinc-500">
            Review your details and complete payment to secure your reservation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Column: Room & Booking Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              {room.coverImageUrl ? (
                <div className="relative h-64 w-full bg-zinc-100 sm:h-72">
                  <Image
                    src={room.coverImageUrl}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-48 w-full items-center justify-center bg-zinc-100">
                  <span className="text-sm text-zinc-400">No cover image</span>
                </div>
              )}
              
              <div className="p-6 sm:p-8">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">{room.name}</h2>
                  <p className="mt-2 text-zinc-500 leading-relaxed">{room.description}</p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Date Badge */}
                  <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-zinc-200">
                      <CalendarDays className="h-4 w-4 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Date</p>
                      <p className="font-medium text-zinc-900">
                        {format(new Date(booking.date), "MMM do, yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Time Badge */}
                  <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4">
                    <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-zinc-200">
                      <Clock className="h-4 w-4 text-zinc-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Time & Duration</p>
                      <p className="font-medium text-zinc-900">
                        {format(new Date(booking.date), "h:mm a")} • {booking.totalHours} {booking.totalHours === 1 ? 'hr' : 'hrs'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Capacity Badge */}
                  {room.capacity && (
                    <div className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 sm:col-span-2">
                      <div className="rounded-full bg-white p-2 shadow-sm ring-1 ring-zinc-200">
                        <Users className="h-4 w-4 text-zinc-600" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">Capacity</p>
                        <p className="font-medium text-zinc-900">Up to {room.capacity} people</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Action */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-zinc-900">Order Summary</h3>
                
                <div className="mt-6 space-y-4 text-sm text-zinc-600">
                  <div className="flex justify-between pb-4 border-b border-zinc-100">
                    <span>${rateInDollars.toFixed(2)} × {booking.totalHours} {booking.totalHours === 1 ? 'hour' : 'hours'}</span>
                    <span className="font-medium text-zinc-900">${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {/* (Optional) Taxes/Fees go here */}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-base font-semibold text-zinc-900">Total</span>
                    <span className="text-xl font-semibold text-zinc-900">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <CheckoutTimer 
                    bookingId={booking.id}
                    tempHold={booking.tempHold!}
                    roomName={room.name}
                    roomId={room.id}
                    date={booking.date}
                    stripeUrl={stripeUrl} 
                  />
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Secure checkout encrypted by Stripe</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}