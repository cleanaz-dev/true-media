"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, Trash2, CalendarDays, ExternalLink, 
  Plus, X, Image as ImageIcon 
} from "lucide-react";

import { getRoomById } from "@/lib/actions/get-room-by-id";
import { updateRoom } from "@/lib/actions/update-room";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Form imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Config imports (Adjust path if needed)
import { AMENITY_CONFIG, RoomFormInput, roomFormSchema, type RoomFormValues } from "./room-config";

export type AdminRoomWithRelations = NonNullable<
  Awaited<ReturnType<typeof getRoomById>>
>;

interface SingleRoomAdminPageProps {
  room: AdminRoomWithRelations;
}

export function SingleRoomAdminPage({ room }: SingleRoomAdminPageProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const existingInfo = (room.info as Record<string, any>) || {};

  // Initialize React Hook Form
 const {
  register,
  handleSubmit,
  watch,
  setValue,
  formState: { errors },
} = useForm<RoomFormInput, unknown, RoomFormValues>({
  resolver: zodResolver(roomFormSchema),
  defaultValues: {
    name: room.name,
    description: room.description || "",
    rate: room.rate,
    capacity: room.capacity || 1,
    coverImageUrl: room.coverImageUrl || "",
    stripePrice: room.stripePriceId || "",
    images: room.images || [],
    amenities: Object.keys(AMENITY_CONFIG).reduce((acc, key) => {
      acc[key] = !!existingInfo[key];
      return acc;
    }, {} as Record<string, boolean>),
  },
});

  // Watch images and amenities to render dynamic UI
  const images = watch("images");
  const amenities = watch("amenities");

  // Dynamic Image Handlers
  const addImage = () => setValue("images", [...images, ""]);
  const removeImage = (index: number) => 
    setValue("images", images.filter((_, i) => i !== index));
  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setValue("images", newImages);
  };

  // Amenity Toggle Handler
  const toggleAmenity = (key: string) => {
    // We cast key as keyof RoomFormValues['amenities'] to satisfy TS
    setValue(`amenities.${key as keyof typeof AMENITY_CONFIG}`, !amenities[key as keyof typeof AMENITY_CONFIG], { shouldValidate: true });
  };

  // --- SUBMIT HANDLER ---
  async function onSubmit(values: RoomFormValues) {
    setIsSaving(true);
    
    const payload = {
      ...values,
      // Clean up empty image strings before saving
      images: values.images.filter((img) => img.trim() !== ""), 
      info: {
        ...values.amenities,
        capacity: values.capacity
      }
    };

    console.log("Saving payload to DB:", payload);

    const result = await updateRoom(room.id, payload);

    if (result.success) {
      router.refresh();
    } else {
      alert("Failed to save. Check console for details.");
    }
    
    setIsSaving(false);
  }

  return (
    <ScrollArea className="h-full w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
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
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Hourly Rate (in Cents)</Label>
                    <Input id="rate" type="number" {...register("rate")} />
                    {errors.rate && <p className="text-sm text-destructive">{errors.rate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity (People)</Label>
                    <Input id="capacity" type="number" {...register("capacity")} />
                    {errors.capacity && <p className="text-sm text-destructive">{errors.capacity.message}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} {...register("description")} />
                    {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
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
                    // Typecast to safely index our amenities state
                    const amenityKey = key as keyof typeof AMENITY_CONFIG;
                    const isActive = amenities[amenityKey];
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAmenity(key)}
                        className={`cursor-pointer flex flex-col items-center justify-center gap-2 rounded-lg border p-4 transition-all hover:bg-muted ${
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
                <div className="space-y-3 pb-6 border-b border-border">
                  <Label htmlFor="coverImageUrl">Cover Image URL (Primary)</Label>
                  <Input id="coverImageUrl" placeholder="https://..." {...register("coverImageUrl")} />
                  {errors.coverImageUrl && <p className="text-sm text-destructive">{errors.coverImageUrl.message}</p>}
                </div>

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
                  <Input 
                    id="hapioResourceId" 
                    defaultValue={room.hapioResourceId} 
                    readOnly 
                    className="bg-muted text-muted-foreground" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripePrice">Stripe Price ID</Label>
                  <Input id="stripePrice" {...register("stripePrice")} />
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
    </ScrollArea>
  );
}