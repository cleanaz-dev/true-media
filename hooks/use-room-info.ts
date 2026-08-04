"use client";

import {
  Wifi,
  MonitorSmartphone,
  Video,
  Printer,
  Snowflake,
  VolumeX,
  Sun,
  PenSquare,
  ArrowUpDown,
  Coffee,
  Accessibility,
  type LucideIcon,
} from "lucide-react";
import { roomInfoSchema, type RoomInfo } from "@/lib/zod/room-schema";

interface FeatureConfig {
  key: keyof Omit<RoomInfo, "capacity">;
  label: string;
  icon: LucideIcon;
}

const FEATURE_CONFIG: FeatureConfig[] = [
  { key: "hasWifi", label: "WiFi", icon: Wifi },
  { key: "hasDisplay", label: "Display / TV", icon: MonitorSmartphone },
  { key: "hasVideoConferencing", label: "Video Conferencing", icon: Video },
  { key: "hasPrinter", label: "Printer", icon: Printer },
  { key: "hasAirConditioning", label: "Air Conditioning", icon: Snowflake },
  { key: "isSoundproof", label: "Soundproof", icon: VolumeX },
  { key: "hasNaturalLight", label: "Natural Light", icon: Sun },
  { key: "hasWhiteboard", label: "Whiteboard", icon: PenSquare },
  { key: "hasStandingDesk", label: "Standing Desk", icon: ArrowUpDown },
  { key: "hasCoffeeTea", label: "Coffee & Tea", icon: Coffee },
  { key: "isWheelchairAccessible", label: "Wheelchair Accessible", icon: Accessibility },
];

export function useRoomInfo(info: unknown) {
  // 1. Defensively parse in case Prisma passed stringified JSON
  let rawData = info;
  if (typeof info === "string") {
    try {
      rawData = JSON.parse(info);
    } catch (e) {
      console.error("Failed to parse info string:", e);
    }
  }

  // 2. Parse against your Zod Schema
  const parsed = roomInfoSchema.safeParse(rawData ?? {});
  
  // 3. Debugging: If it fails, log WHY it failed in the console
  if (!parsed.success) {
    console.error("Zod Schema Error:", parsed.error.format());
  }

  // 4. Safely extract data
  const data = parsed.success ? parsed.data : ({} as RoomInfo);

  // 5. Build features array
  const features = FEATURE_CONFIG.filter((f) => data[f.key] === true);

  return {
    data,
    features,
    capacity: data?.capacity,
  };
}