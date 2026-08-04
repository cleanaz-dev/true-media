import { SiteHeader } from "@/components/site/site-header"
import { Hero } from "@/components/site/hero"
import { StudioSpaces } from "@/components/site/studio-spaces"
import { Services } from "@/components/site/services"
import { Testimonials } from "@/components/site/testimonials"
import { Pricing } from "@/components/site/pricing"
import { Contact } from "@/components/site/contact"
import { SiteFooter } from "@/components/site/site-footer"

export default function Home() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <StudioSpaces />
        <Services />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  )
}
