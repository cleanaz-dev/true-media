"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ArrowRight, Play } from "lucide-react"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    src: "/images/hero-1.png",
    alt: "Main film studio with professional lighting",
    tag: "Main Studio",
  },
  {
    src: "/images/hero-2.png",
    alt: "Podcast recording studio with microphones",
    tag: "Podcast Suite",
  },
  {
    src: "/images/hero-3.png",
    alt: "Photography studio with a white cyclorama backdrop",
    tag: "Photo Studio",
  },
]

export function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative h-svh min-h-[640px] w-full overflow-hidden">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={i !== active}
        >
          <Image
            src={slide.src || "/placeholder.svg"}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75" />
      <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-primary" />
            Creative studios for hire
          </span>

          <h1 className="mt-6 text-balance font-serif text-4xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Where creators bring ideas to life.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-white/80">
            True Media Studios offers fully-equipped spaces for content creation,
            podcasting, photography, and video production. Book by the hour, day, or
            build a custom package.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#pricing"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Book Your Space
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#spaces"
              className="inline-flex h-13 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Play className="size-4 fill-current" />
              Explore Spaces
            </a>
          </div>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute inset-x-0 bottom-8 z-10 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${slide.tag}`}
              className="group flex items-center gap-2"
            >
              <span
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === active ? "w-10 bg-primary" : "w-5 bg-white/40 group-hover:bg-white/70",
                )}
              />
            </button>
          ))}
        </div>
        <span className="hidden text-xs font-medium uppercase tracking-widest text-white/70 sm:block">
          {SLIDES[active].tag}
        </span>
      </div>
    </section>
  )
}
