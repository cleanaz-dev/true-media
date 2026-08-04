// components/emails/booking-confirmation.tsx
import * as React from 'react';
import { Booking, Room, User } from '@/lib/generated/prisma/client';

interface BookingConfirmationEmailProps {
  user: User;
  booking: Booking;
  room: Room;
}

export function BookingConfirmationEmail({ 
  user, 
  booking, 
  room 
}: BookingConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', color: '#333' }}>
      <h1>Booking Confirmed!</h1>
      <p>Hi {user.name},</p>
      <p>Your booking for <strong>{room.name}</strong> has been successfully confirmed.</p>
      
      <div style={{ padding: '16px', backgroundColor: '#f4f4f5', borderRadius: '8px', marginTop: '20px' }}>
        <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(booking.date).toLocaleTimeString()}</p>
        <p><strong>Duration:</strong> {booking.totalHours} hour(s)</p>
      </div>

      <p style={{ marginTop: '32px' }}>Thank you for booking with us!</p>
    </div>
  );
}