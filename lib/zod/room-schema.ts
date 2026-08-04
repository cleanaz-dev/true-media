import { z } from "zod";

export const roomInfoSchema = z.object({
  hasWifi: z.boolean().optional().default(false),
  hasDisplay: z.boolean().optional().default(false),
  hasVideoConferencing: z.boolean().optional().default(false),
  hasPrinter: z.boolean().optional().default(false),
  hasAirConditioning: z.boolean().optional().default(false),
  isSoundproof: z.boolean().optional().default(false),
  hasNaturalLight: z.boolean().optional().default(false),
  hasWhiteboard: z.boolean().optional().default(false),
  hasStandingDesk: z.boolean().optional().default(false),
  hasCoffeeTea: z.boolean().optional().default(false),
  isWheelchairAccessible: z.boolean().optional().default(false),
  capacity: z.number().optional(), 
});

export type RoomInfo = z.infer<typeof roomInfoSchema>;