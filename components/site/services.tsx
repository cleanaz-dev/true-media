import Image from "next/image"
import { Clapperboard, Mic, Camera, Video } from "lucide-react"

const SERVICES = [
  {
    icon: Clapperboard,
    title: "Content Creation",
    image: "/images/service-content-creation.png",
    description:
      "Ready-to-shoot sets, ring lights, and props for social-first content — TikTok, Reels, and YouTube.",
  },
  {
    icon: Mic,
    title: "Podcast Studio",
    image: "/images/service-podcast.png",
    description:
      "Broadcast-quality mics, mixers, and acoustic treatment for crisp multi-guest recordings.",
  },
  {
    icon: Camera,
    title: "Photography",
    image: "/images/service-photography.png",
    description:
      "Seamless backdrops, strobes, and modifiers for product, portrait, and editorial shoots.",
  },
  {
    icon: Video,
    title: "Video Production",
    image: "/images/service-video.png",
    description:
      "Cinema cameras, gimbals, and lighting with room for a full crew and on-set monitoring.",
  },
]

export function Services() {
  return (
    <section id="services" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Our Services
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
            Everything you need under one roof
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Show up with your idea — the gear, the space, and the support are already here.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <article
                key={service.title}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 grid size-11 place-items-center rounded-xl bg-background/90 text-primary backdrop-blur">
                    <Icon className="size-5" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
