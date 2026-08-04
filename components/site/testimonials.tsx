import Image from "next/image"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const REVIEWS = [
  {
    name: "Sofia Martinez",
    role: "Content Creator",
    avatar: "/images/avatar-1.png",
    rating: 5,
    date: "2 weeks ago",
    text: "Booked the main studio for a brand shoot and it was flawless. The lighting rig saved us hours and the team helped us reset between setups. Already rebooked.",
  },
  {
    name: "James Whitfield",
    role: "Podcast Host",
    avatar: "/images/avatar-2.png",
    rating: 5,
    date: "1 month ago",
    text: "The podcast suite sounds incredible — zero room echo and the mics are top tier. Our episodes have never sounded this clean. Highly recommend for any creator.",
  },
  {
    name: "Daniel Okafor",
    role: "Photographer",
    avatar: "/images/avatar-3.png",
    rating: 5,
    date: "1 month ago",
    text: "Seamless backdrops, great modifiers, and a green room that keeps clients comfortable. It feels premium without the premium price tag. My go-to studio now.",
  },
]

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted",
          )}
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="reviews" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              What Creators Say
            </p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
              Loved by creators across the city
            </h2>
          </div>

          {/* Rating summary card */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-card px-6 py-4">
            <div className="text-center">
              <div className="font-serif text-4xl font-semibold text-foreground">4.9</div>
              <Stars rating={5} className="mt-1 justify-center" />
            </div>
            <div className="border-l border-border pl-4 text-sm leading-relaxed text-muted-foreground">
              Based on <span className="font-semibold text-foreground">248 reviews</span>
              <br />
              across Google &amp; Trustpilot
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.map((review) => (
            <figure
              key={review.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={review.avatar || "/placeholder.svg"}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="size-12 rounded-full object-cover"
                />
                <div>
                  <figcaption className="font-semibold text-foreground">
                    {review.name}
                  </figcaption>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Stars rating={review.rating} />
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>

              <blockquote className="mt-3 text-pretty leading-relaxed text-foreground/90">
                {review.text}
              </blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
