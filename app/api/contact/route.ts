// app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Handle the form data (send email, save to DB, etc.)
  console.log('Contact form submission:', data);
  
  return NextResponse.json({ success: true });
}