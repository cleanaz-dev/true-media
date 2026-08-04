"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type Space = {
  id: string
  name: string
  image: string
  description: string
  size: string
}

const SPACES: Space[] = [
  {
    id: "main-studio",
    name: "Main Studio",
    image: "/images/space-main-studio.png",
    description:
      "A 1,200 sq ft blackout studio with cinema-grade lighting rigs, backdrops, and a full grid for large productions.",
    size: "1,200 sq ft",
  },
  {
    id: "meeting-room",
    name: "Meeting Room",
    image: "/images/space-meeting-room.png",
    description:
      "A bright, glass-walled room with a large display and seating for eight — ideal for planning and client sessions.",
    size: "Seats 8",
  },
  {
    id: "green-room",
    name: "Green Room",
    image: "/images/space-green-room.png",
    description:
      "A comfortable talent lounge with vanity mirrors, wardrobe space, and refreshments to prep before you shoot.",
    size: "Talent lounge",
  },
  {
    id: "relaxation-room",
    name: "Relaxation Room",
    image: "/images/space-relaxation-room.png",
    description:
      "A calm, low-light space to decompress between sessions with soft seating and ambient sound.",
    size: "Chill space",
  },
]

const FILTERS = [
  { id: "all", label: "All Spaces" },
  { id: "main-studio", label: "Main Studio" },
  { id: "meeting-room", label: "Meeting Room" },
  { id: "green-room", label: "Green Room" },
  { id: "relaxation-room", label: "Relaxation Room" },
]

export function StudioSpaces() {
  const [filter, setFilter] = useState("all")
  const visible = filter === "all" ? SPACES : SPACES.filter((s) => s.id === filter)
  const isAll = filter === "all"

  return (
    <section id="spaces" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Our Studio Spaces
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              Spaces built for every kind of creator
            </h2>
          </div>
          <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
            From full film productions to intimate podcast recordings — pick a room
            and see exactly what you&apos;re booking.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Image grid */}
        <div
          className={cn(
            "mt-10 grid gap-5",
            isAll ? "sm:grid-cols-2" : "grid-cols-1",
          )}
        >
          {visible.map((space) => (
            <article
              key={space.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-border bg-card",
                isAll ? "aspect-[4/3]" : "aspect-[16/9]",
              )}
            >
              <Image
                src={space.image || "/placeholder.svg"}
                alt={space.name}
                fill
                sizes={isAll ? "(min-width: 640px) 50vw, 100vw" : "100vw"}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-2xl font-semibold text-white">
                    {space.name}
                  </h3>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    {space.size}
                  </span>
                </div>
                <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-white/80">
                  {space.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
