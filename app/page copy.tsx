import Footer from "@/components/landing-page/footer";
import HeroSection from "@/components/landing-page/hero-section";
import NavBar from "@/components/landing-page/nav-bar";
import OurServices from "@/components/landing-page/our-services";
import PricingContact from "@/components/landing-page/pricing-contact";
import Social from "@/components/landing-page/social";
import StudioSpaces from "@/components/landing-page/studio-spaces";

export default function Home() {
  return (
    <div className="">
     <main>
      <NavBar />
      <HeroSection />
      <StudioSpaces />
      <OurServices />
      <Social />
      <PricingContact />
      <Footer />
     </main>
    </div>
  );
}
