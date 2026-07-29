"use client"
import { getAllRooms } from "@/lib/actions/get-all-rooms";
import { DoorOpen } from "lucide-react";
import { AdminPageHeader } from "../admin-page-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminRoomCard } from "@/components/admin/room/admin-room-card";

export type RoomsWithRelations = Awaited<
  ReturnType<typeof getAllRooms>
>[number];

interface AdminRoomPageProps {
  rooms: RoomsWithRelations[];
}

export function AdminRoomPage({ rooms }: AdminRoomPageProps) {
  
  return (
    <div className="flex h-full flex-col">
      <div className="px-8 pt-8">
        <AdminPageHeader
          description="View and manage all rooms here."
          icon={DoorOpen}
          action={{
            label: "New Room",
            href: "/admin/rooms/new",
          }}
        />
      </div>

      <ScrollArea className="mt-6 flex-1 px-4 pb-8 md:px-8">
        {rooms.length === 0 ? (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
            No rooms found. Get started by creating one.
          </div>
        ) : (
           <div className="mx-auto w-full max-w-7xl grid grid-cols-1 gap-6 xl:grid-cols-1">
            {rooms.map((room) => (
              <AdminRoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}