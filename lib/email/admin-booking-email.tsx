// components/emails/admin-booking-email.tsx
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';
import { Booking, Room, User } from '@/lib/generated/prisma/client';

interface AdminBookingEmailProps {
  user: User;
  booking: Booking;
  room: Room;
}

export function AdminBookingEmail({
  user,
  booking,
  room,
}: AdminBookingEmailProps) {
  const bookingDate = new Date(booking.date);

  return (
    <Html lang="en">
      <Head />
      <Preview>
        New booking: {room.name} — {user.name}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Booking Received</Heading>

          <Text style={text}>
            A new booking has just come in. Here are the details:
          </Text>

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Room:</strong> {room.name}
            </Text>
            <Text style={detailRow}>
              <strong>Date:</strong> {bookingDate.toLocaleDateString()}
            </Text>
            <Text style={detailRow}>
              <strong>Time:</strong> {bookingDate.toLocaleTimeString()}
            </Text>
            <Text style={detailRow}>
              <strong>Duration:</strong> {booking.totalHours} hour(s)
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={detailsBox}>
            <Text style={detailRow}>
              <strong>Tenant:</strong> {user.name}
            </Text>
            <Text style={detailRow}>
              <strong>Email:</strong> {user.email}
            </Text>
            {user.phone ? (
              <Text style={detailRow}>
                <strong>Phone:</strong> {user.phone}
              </Text>
            ) : null}
            <Text style={detailRow}>
              <strong>Booking ID:</strong> {booking.id}
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            You&apos;re receiving this because a booking was made on the platform.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminBookingEmail;

const main: React.CSSProperties = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  backgroundColor: '#ffffff',
  color: '#333333',
};

const container: React.CSSProperties = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const heading: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#111111',
};

const text: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#333333',
};

const detailsBox: React.CSSProperties = {
  padding: '16px',
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  marginTop: '20px',
};

const detailRow: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#333333',
  margin: '4px 0',
};

const hr: React.CSSProperties = {
  borderColor: '#e6e6e6',
  margin: '32px 0 20px',
};

const footerText: React.CSSProperties = {
  fontSize: '13px',
  lineHeight: '20px',
  color: '#888888',
};