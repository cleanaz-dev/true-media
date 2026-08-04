import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const PLANS = [
  {
    name: "Hourly",
    price: "$75",
    unit: "/ hour",
    description: "Perfect for quick shoots and short recording sessions.",
    features: [
      "Access to any single space",
      "Standard lighting & backdrops",
      "2-hour minimum booking",
      "In-studio Wi-Fi & refreshments",
    ],
    featured: false,
    cta: "Book Now",
  },
  {
    name: "Full Day",
    price: "$540",
    unit: "/ day",
    description: "Best value for full productions and multi-setup days.",
    features: [
      "Up to 8 hours, any space",
      "Full lighting & grip package",
      "Green room + relaxation room",
      "On-site studio assistant",
      "Priority booking calendar",
    ],
    featured: true,
    cta: "Book Now",
  },
  {
    name: "Custom",
    price: "Let's talk",
    unit: "",
    description: "Tailored packages for recurring shoots and teams.",
    features: [
      "Multi-day & recurring rates",
      "Dedicated production support",
      "Equipment rental add-ons",
      "Flexible cancellation terms",
    ],
    featured: false,
    cta: "Book Now",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing &amp; Packages
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
            Simple pricing, no surprises
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Choose the option that fits your project. Every booking includes access to
            our shared amenities.
          </p>
        </div>

        <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-3xl border p-8",
                plan.featured
                  ? "border-primary bg-primary text-primary-foreground shadow-xl shadow-primary/20 lg:-mt-4 lg:pb-12"
                  : "border-border bg-card text-card-foreground",
              )}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-background px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                  Most Popular
                </span>
              )}

              <h3
                className={cn(
                  "font-serif text-2xl font-semibold",
                  plan.featured ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {plan.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-serif text-4xl font-semibold">{plan.price}</span>
                {plan.unit && (
                  <span
                    className={cn(
                      "text-sm",
                      plan.featured ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {plan.unit}
                  </span>
                )}
              </div>

              <p
                className={cn(
                  "mt-3 text-pretty text-sm leading-relaxed",
                  plan.featured ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {plan.description}
              </p>

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <span
                      className={cn(
                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full",
                        plan.featured
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-accent text-primary",
                      )}
                    >
                      <Check className="size-3" />
                    </span>
                    <span className={plan.featured ? "text-primary-foreground/90" : "text-foreground/90"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="/rooms"
                className={cn(
                  "mt-8 inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors",
                  plan.featured
                    ? "bg-background text-primary hover:bg-background/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
