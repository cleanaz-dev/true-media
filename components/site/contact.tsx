"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Check } from "lucide-react"

const DETAILS = [
  {
    icon: MapPin,
    label: "Visit us",
    value: "125 Creative Quarter, London EC2A 4PH",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+44 20 7946 0123",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "hello@truemediastudios.com",
  },
  {
    icon: Clock,
    label: "Opening hours",
    value: "Mon–Sun · 7:00am – 11:00pm",
  },
]

export function Contact() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contact" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Get In Touch
          </p>
          <h2 className="mt-3 text-balance font-serif text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
            Let&apos;s plan your next shoot
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Tell us about your project and we&apos;ll get back to you within one
            business day.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Left: form */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            {submitted ? (
              <div className="flex h-full min-h-80 flex-col items-center justify-center text-center">
                <span className="grid size-14 place-items-center rounded-full bg-accent text-primary">
                  <Check className="size-7" />
                </span>
                <h3 className="mt-5 font-serif text-2xl font-semibold text-foreground">
                  Message sent
                </h3>
                <p className="mt-2 max-w-sm text-pretty leading-relaxed text-muted-foreground">
                  Thanks for reaching out. Our team will be in touch shortly to help
                  plan your booking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Jane Creator"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="jane@studio.com"
                      className="input-base"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone" htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+44 …"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Space of interest" htmlFor="space">
                    <select id="space" name="space" className="input-base" defaultValue="">
                      <option value="" disabled>
                        Select a space
                      </option>
                      <option>Main Studio</option>
                      <option>Meeting Room</option>
                      <option>Green Room</option>
                      <option>Relaxation Room</option>
                      <option>Not sure yet</option>
                    </select>
                  </Field>
                </div>

                <Field label="Tell us about your project" htmlFor="message">
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="What are you shooting, and when?"
                    className="input-base resize-none"
                  />
                </Field>

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right: details + map */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {DETAILS.map((detail) => {
                const Icon = detail.icon
                return (
                  <div
                    key={detail.label}
                    className="rounded-2xl border border-border bg-card p-5"
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                      <Icon className="size-5" />
                    </span>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {detail.label}
                    </p>
                    <p className="mt-1 text-pretty text-sm font-medium leading-relaxed text-foreground">
                      {detail.value}
                    </p>
                  </div>
                )
              })}
            </div>

            <div className="flex-1 overflow-hidden rounded-2xl border border-border">
              <iframe
                title="True Media Studios location map"
                src="https://www.google.com/maps?q=Shoreditch,London&output=embed"
                className="h-full min-h-64 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
