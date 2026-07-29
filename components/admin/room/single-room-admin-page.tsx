"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Trash2, CalendarDays, ExternalLink, 
  Plus, X, Image as ImageIcon, Wifi, Monitor, Video, Printer, 
  Snowflake, VolumeX, Sun, Presentation, ArrowUpToLine, Coffee, Accessibility 
} from "lucide-react";

import { getRoomById } from "@/lib/actions/get-room-by-id";
import { updateRoom } from "@/lib/actions/update-room";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AdminRoomWithRelations = NonNullable<
  Awaited<ReturnType<typeof getRoomById>>
>;

// Reusing your amenity config for the toggles
const AMENITY_CONFIG = {
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

interface SingleRoomAdminPageProps {
  room: AdminRoomWithRelations;
}

export function SingleRoomAdminPage({ room }: SingleRoomAdminPageProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // --- COMPLEX STATE MANAGEMENT ---
  // 1. Dynamic Images Array
  const [images, setImages] = useState<string[]>(room.images || []);
  
  // 2. Amenities (JSON)
  const existingInfo = (room.info as Record<string, any>) || {};
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    hasWifi: !!existingInfo.hasWifi,
    hasDisplay: !!existingInfo.hasDisplay,
    hasVideoConferencing: !!existingInfo.hasVideoConferencing,
    hasPrinter: !!existingInfo.hasPrinter,
    hasAirConditioning: !!existingInfo.hasAirConditioning,
    isSoundproof: !!existingInfo.isSoundproof,
    hasNaturalLight: !!existingInfo.hasNaturalLight,
    hasWhiteboard: !!existingInfo.hasWhiteboard,
    hasStandingDesk: !!existingInfo.hasStandingDesk,
    hasCoffeeTea: !!existingInfo.hasCoffeeTea,
    isWheelchairAccessible: !!existingInfo.isWheelchairAccessible,
  });

  // Dynamic Image Handlers
  const addImage = () => setImages([...images, ""]);
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));
  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  // Amenity Toggle Handler
  const toggleAmenity = (key: string) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- SUBMIT HANDLER ---
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    // Get standard text inputs from the form
    const formData = new FormData(e.currentTarget);
    
    // Build the final payload, injecting our React state
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      rate: formData.get("rate"),
      coverImageUrl: formData.get("coverImageUrl"),
      stripePrice: formData.get("stripePrice"),
      // Clean up empty image strings before saving
      images: images.filter((img) => img.trim() !== ""), 
      info: {
        ...amenities,
        capacity: Number(formData.get("capacity") || existingInfo.capacity || 1)
      }
    };

    console.log("Saving payload to DB:", payload);

    // Call the server action
    const result = await updateRoom(room.id, payload);

    if (result.success) {
      router.refresh(); // Refresh to get updated data
    } else {
      alert("Failed to save. Check console for details.");
    }
    
    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/rooms" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Room</h1>
            <p className="text-sm text-muted-foreground">ID: {room.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="destructive" className="px-4">
            <Trash2 className="h-4 w-4" data-icon="inline-start" /> Delete
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4" data-icon="inline-start" /> 
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="grid gap-8 lg:col-span-2">
          
          {/* GENERAL INFO */}
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input id="name" name="name" defaultValue={room.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Hourly Rate (in Cents)</Label>
                  <Input id="rate" name="rate" type="number" defaultValue={room.rate} required />
                  <p className="text-xs text-muted-foreground">Currently: ${(room.rate / 100).toFixed(2)} CAD</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (People)</Label>
                  <Input id="capacity" name="capacity" type="number" defaultValue={existingInfo.capacity || 1} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={room.description} rows={4} required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AMENITIES (DYNAMIC JSON) */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
              <CardDescription>Select all that apply to this room.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(AMENITY_CONFIG).map(([key, config]) => {
                  const isActive = amenities[key];
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggleAmenity(key)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all hover:bg-muted ${
                        isActive ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-xs font-medium">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* MEDIA (DYNAMIC ARRAY) */}
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
              <CardDescription>Manage cover and additional images.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cover Image */}
              <div className="space-y-3 pb-6 border-b border-border">
                <Label htmlFor="coverImageUrl">Cover Image URL (Primary)</Label>
                <Input id="coverImageUrl" name="coverImageUrl" defaultValue={room.coverImageUrl || ""} placeholder="https://..." />
              </div>

              {/* Additional Images Array */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Additional Images</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus className="h-4 w-4" data-icon="inline-start" /> Add Image
                  </Button>
                </div>
                
                {images.length === 0 && (
                  <div className="text-sm text-muted-foreground italic py-2">No additional images added.</div>
                )}

                <div className="space-y-3">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input 
                        value={img} 
                        onChange={(e) => updateImage(index, e.target.value)} 
                        placeholder="https:// image url..." 
                      />
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)} className="shrink-0 text-destructive">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hapioResourceId">Hapio Resource ID</Label>
                <Input id="hapioResourceId" name="hapioResourceId" defaultValue={room.hapioResourceId} readOnly className="bg-muted text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stripePrice">Stripe Price ID</Label>
                <Input id="stripePrice" name="stripePrice" defaultValue={room.stripePrice || ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {room.bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-center text-muted-foreground">
                  <CalendarDays className="mb-2 h-8 w-8 opacity-50" />
                  <p className="text-sm">No bookings yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {room.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between rounded-md border border-border p-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">ID: {booking.id.slice(-6)}...</p>
                        <p className="text-xs text-muted-foreground">Tx: {booking.transactions?.length || 0}</p>
                      </div>
                      <Button variant="ghost" size="icon" type="button">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}