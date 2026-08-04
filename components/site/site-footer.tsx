const COLUMNS = [
  {
    title: "Spaces",
    links: ["Main Studio", "Meeting Room", "Green Room", "Relaxation Room"],
  },
  {
    title: "Services",
    links: ["Content Creation", "Podcast Studio", "Photography", "Video Production"],
  },
  {
    title: "Company",
    links: ["About Us", "Pricing", "Reviews", "Contact"],
  },
]

const SOCIALS = [
  { src: "/icons/instagram.svg", label: "Instagram" },
  { src: "/icons/youtube.svg", label: "YouTube" },
  { src: "/icons/x.svg", label: "X" },
  { src: "/icons/linkedin.svg", label: "LinkedIn" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <a href="#top" className="flex items-center gap-2 text-foreground">
              <span className="grid size-8 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                TM
              </span>
              <span className="font-serif text-lg font-semibold">
                True Media <span className="font-normal">Studios</span>
              </span>
            </a>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
              Premium creative studios for content creators, podcasters, and film
              teams. Book by the hour, day, or build a custom package.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="group grid size-10 place-items-center rounded-full border border-border bg-background transition-colors hover:border-primary"
                >
                  <span
                    aria-hidden="true"
                    className="size-4 bg-muted-foreground transition-colors group-hover:bg-primary"
                    style={{
                      maskImage: `url(${social.src})`,
                      WebkitMaskImage: `url(${social.src})`,
                      maskRepeat: "no-repeat",
                      WebkitMaskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskPosition: "center",
                      maskSize: "contain",
                      WebkitMaskSize: "contain",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} True Media Studios. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
