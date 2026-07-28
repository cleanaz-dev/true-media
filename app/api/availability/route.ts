// app/api/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkHapioAvailability } from "@/lib/actions/check-availability";

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date) return NextResponse.json(null);

  const result = await checkHapioAvailability(date);
  return NextResponse.json(result);
}