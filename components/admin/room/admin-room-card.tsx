"use client";

import Link from "next/link";
import {
  Edit,
  Image as ImageIcon,
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
  LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

import { RoomsWithRelations } from "./admin-rooms-page";
import { roomInfoSchema, type RoomInfo } from "@/lib/zod/room-schema";

const AMENITY_CONFIG: Record<
  keyof Omit<RoomInfo, "capacity">,
  { label: string; icon: LucideIcon }
> = {
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
};

function RoomAmenities({ info }: { info: RoomInfo }) {
  const amenities = Object.entries(AMENITY_CONFIG).map(([key, config]) => {
    return {
      key,
      label: config.label,
      Icon: config.icon,
      isActive: Boolean(info[key as keyof typeof AMENITY_CONFIG]),
    };
  });

  amenities.sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return a.label.localeCompare(b.label);
  });

  return (
    <div className="mt-6">
      <span className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Included Amenities
      </span>
      <div className="flex flex-wrap gap-x-5 gap-y-3 bg-muted p-4 rounded-md">
        {amenities.map(({ key, label, Icon, isActive }) => (
          <div
            key={key}
            className={`flex items-center gap-2 text-sm ${
              isActive
                ? "font-medium text-foreground"
                : "text-muted-foreground opacity-30"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface AdminRoomCardProps {
  room: RoomsWithRelations;
}

export function AdminRoomCard({ room }: AdminRoomCardProps) {
  const formattedRate = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(room.rate / 100);

  const info =
    roomInfoSchema.safeParse(room.info ?? {}).data || roomInfoSchema.parse({});

  return (
    <Card className="group flex flex-col md:flex-row overflow-hidden transition-all hover:shadow-lg border-muted-foreground/20">
      {/* Left: Image Banner */}
      <div className="relative h-[240px] w-full md:h-auto md:w-[340px] shrink-0 overflow-hidden bg-muted">
        {room.coverImageUrl ? (
          <img
            src={room.coverImageUrl}
            alt={room.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
            <ImageIcon className="mb-2 h-8 w-8 opacity-50" />
            <span className="text-xs font-medium uppercase tracking-wider opacity-70">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Right: Content & Details */}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Header & Price */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">
              {room.name}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed max-w-[500px]">
              {room.description || "No description provided for this room."}
            </p>
          </div>

          <div className="flex flex-col text-left sm:text-right shrink-0">
            <span className="text-2xl font-bold text-foreground">
              {formattedRate}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
              per hour
            </span>
          </div>
        </div>

        {/* Amenities section takes up remaining space */}
        <div className="flex-1">
          <RoomAmenities info={info} />
        </div>

        {/* Action Button at the bottom */}
        <div className="mt-8 flex items-center justify-end border-t border-border/40 pt-6">
          {/* Changed from <Button asChild> to buttonVariants on Next/Link */}
          <Link
            href={`/admin/rooms/${room.id}`}
            className={buttonVariants({ variant: "default" })}
          >
            Edit Room
            <Edit className="h-4 w-4" data-icon="inline-start" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
