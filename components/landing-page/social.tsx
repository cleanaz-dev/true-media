"use client";

import Image from 'next/image';
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BlueLine from "../ui/BlueLine";
import SocialBackgroundImage from "@/public/images/hero-image-02.jpg";

export default function Social() {
  const testimonials = [
    {
      quote:
        "TRUE MEDIA provided the perfect environment for our podcast series. The professional equipment and soundproofing made a huge difference in our audio quality.",
      author: "Sarah J.",
      role: "Podcast Host",
    },
    {
      quote:
        "As a YouTuber, having access to TRUE MEDIA's facilities has elevated my content to the next level. The team is supportive and the equipment is top-notch.",
      author: "Michael T.",
      role: "Content Creator",
    },
    {
      quote:
        "The flexibility of the studio spaces allowed us to create exactly what we envisioned for our brand campaign. Highly recommended for professional shoots.",
      author: "Emma R.",
      role: "Marketing Director",
    },
  ];

  const stats = [
    { number: "5.48K+", label: "Content Projects" },
    { number: "72.5K+", label: "Community Members" },
    { number: "6+", label: "Specialized Studios" },
  ];

  return (
    <div>
      {/* Testimonials Section */}
      <section className="relative py-20 px-4 md:min-h-[850px] flex items-center">
        {/* Background Image with Next.js Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={SocialBackgroundImage}
            alt="Background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-blue-700/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Creators Say
            </h2>
            <BlueLine width="w-16" className="mb-4" />
            <p className="text-xl text-gray-200">
              Experiences from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/95 backdrop-blur-sm hover:bg-white transition-colors"
              >
                <CardContent className="p-6">
                  <Quote className="w-10 h-10 text-blue-600 mb-4" />
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-semibold text-gray-900">
                      - {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-40 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Centered Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About TRUE MEDIA
            </h2>
            <BlueLine width="w-16" className="mb-4" />
            <p className="text-xl text-gray-600">
              Your creative vision, our professional resources
            </p>
          </div>

          {/* Two-column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: Text */}
            <div className="text-left">
              <p className="text-gray-700 leading-relaxed mb-4">
                TRUE MEDIA is a Toronto/Markham-based media hub focused on
                becoming a central platform for digital content creation across
                sports, lifestyle, and entertainment. We provide a dynamic
                environment for creators — including YouTubers, TikTok
                influencers, and podcasters — to produce, collaborate, and
                distribute high-quality content.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our goal is to support the booming creator economy in Ontario,
                foster local digital talent, and establish a hub that blends
                creativity, technology, and entrepreneurship.
              </p>
            </div>

            {/* Right: Stats */}
            <div className="flex flex-col md:flex-row gap-6 justify-center lg:justify-start">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all border border-gray-100 p-8 text-center"
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-base text-gray-700 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}