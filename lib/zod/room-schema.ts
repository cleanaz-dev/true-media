import { z } from "zod";

export const roomInfoSchema = z.object({
  // Tech & Connectivity
  hasWifi: z.boolean().default(true),
  hasDisplay: z.boolean().default(false), // TV / Monitor / Projector
  hasVideoConferencing: z.boolean().default(false), // Webcam / Mic setup
  hasPrinter: z.boolean().default(false),
  
  // Environment & Comfort
  hasAirConditioning: z.boolean().default(true),
  isSoundproof: z.boolean().default(false),
  hasNaturalLight: z.boolean().default(false),
  
  // Workspace Tools
  hasWhiteboard: z.boolean().default(false),
  hasStandingDesk: z.boolean().default(false),
  
  // Perks & Accessibility
  hasCoffeeTea: z.boolean().default(false),
  isWheelchairAccessible: z.boolean().default(false),
  
  // Optional: Capacity is usually a number, but incredibly useful for the 'info' JSON
  capacity: z.number().int().positive().optional(),
});

export type RoomInfo = z.infer<typeof roomInfoSchema>;