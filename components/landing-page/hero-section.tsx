'use client';

import { useState, useEffect } from 'react';
import Image, {StaticImageData} from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroImage1 from "@/public/images/hero-image-02.jpg"
import HeroImage2 from "@/public/images/hero-image-03.jpg"
import HeroImage3 from "@/public/images/hero-image-04.jpg"

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const images: StaticImageData[] = [
    HeroImage1,
    HeroImage2,
    HeroImage3
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Studio ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:mt-40">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 max-w-5xl">
          Toronto&apos;s Premier Content Creation Hub
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl">
          A dynamic environment for creators to produce, collaborate, and distribute high-quality content
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="text-lg px-8 py-6">
            Explore Studios
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 text-white border-white hover:bg-white/20">
            Book Now
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}