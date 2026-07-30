import { z } from "zod";
import {
  Wifi,
  Monitor,
  Video,
  Printer,
  Snowflake,
  VolumeX,
  Sun,
  Presentation,
  ArrowUpToLine,
  Coffee,
  Accessibility,
} from "lucide-react";

export const AMENITY_CONFIG = {
  hasWifi: { label: "Wi-Fi", icon: Wifi },
  hasDisplay: { label: "Display", icon: Monitor },
  hasVideoConferencing: { label: "Video Conf", icon: Video },
  hasPrinter: { label: "Printer", icon: Printer },
  hasAirConditioning: { label: "A/C", icon: Snowflake },
  isSoundproof: { label: "Soundproof", icon: VolumeX },
  hasNaturalLight: { label: "Natural Light", icon: Sun },
  hasWhiteboard: { label: "Whiteboard", icon: Presentation },
  hasStandingDesk: { label: "Standing Desk", icon: ArrowUpToLine },
  hasCoffeeTea: { label: "Coffee/Tea", icon: Coffee },
  isWheelchairAccessible: { label: "Accessible", icon: Accessibility },
} as const;

export const roomFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  
  rate: z.coerce.number().min(0, "Rate must be positive"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  
  coverImageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  stripePrice: z.string().optional().or(z.literal("")),
  
  images: z.array(z.string()),
  
  // Explicit 2-argument record
  amenities: z.record(z.string(), z.boolean()), 
});

export type RoomFormInput = z.input<typeof roomFormSchema>;
export type RoomFormValues = z.output<typeof roomFormSchema>;