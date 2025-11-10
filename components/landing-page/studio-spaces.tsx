"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlueLine from "../ui/BlueLine";
import MainStudioSpaceImage from "@/public/images/main-space.jpg";
import BrightMeetingSpaceImage from "@/public/images/bright-meeting-space.jpg";
import GreenRoomImage from "@/public/images/green-room-space.jpg";
import ExteriorImage from "@/public/images/exterior-space.jpg";

export default function StudioSpaces() {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const spaces: Array<{
    id: string;
    name: string;
    title: string;
    description: string;
    image: string | StaticImageData;
  }> = [
    {
      id: "all",
      name: "All Spaces",
      title: "All Our Spaces",
      description: "Complete overview of our facilities",
      image: MainStudioSpaceImage,
    },
    {
      id: "main",
      name: "Main Studio",
      title: "Main Studio",
      description:
        "Professional recording environment with versatile shooting space",
      image: MainStudioSpaceImage,
    },
    {
      id: "meeting",
      name: "Meeting Room",
      title: "Bright Meeting Space",
      description: "Natural light for creative brainstorming",
      image: BrightMeetingSpaceImage,
    },
    {
      id: "green",
      name: "Green Room",
      title: "Green Room",
      description: "Dedicated space for talent preparation",
      image: GreenRoomImage,
    },
    {
      id: "office",
      name: "Office Space",
      title: "Relaxation Area",
      description: "Comfortable space between shoots",
      image: GreenRoomImage,
    },
    {
      id: "exterior",
      name: "Exterior",
      title: "Building Exterior",
      description: "Modern facility with easy access",
      image: ExteriorImage,
    },
  ];

  const openFullscreen = (index: number) => {
    setSelectedImage(index);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Studio Spaces
          </h2>
          <BlueLine width="w-16" className="mb-4" />
          <p className="text-xl text-gray-600">
            Professional environments designed for creators
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {spaces.map((space, index) => (
            <Button
              key={space.id}
              variant={selectedImage === index ? "default" : "outline"}
              onClick={() => setSelectedImage(index)}
              className="text-sm md:text-base"
            >
              {space.name}
            </Button>
          ))}
        </div>

        {/* Main Image Display */}
        {selectedImage === 0 ? (
          // Show all images in grid when "All Spaces" is selected
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.slice(1).map((space, index) => (
              <div
                key={space.id}
                className="relative h-[300px] rounded-lg overflow-hidden shadow-lg cursor-pointer group"
                onClick={() => openFullscreen(index + 1)}
              >
                <Image
                  src={space.image}
                  alt={space.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-bold mb-1">{space.title}</h3>
                  <p className="text-sm text-gray-200">{space.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show single image when specific space is selected
          <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={spaces[selectedImage].image}
              alt={spaces[selectedImage].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Image Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                {spaces[selectedImage].title}
              </h3>
              <p className="text-lg md:text-xl text-gray-200">
                {spaces[selectedImage].description}
              </p>
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={() => openFullscreen(selectedImage)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-colors"
            >
              View Fullscreen
            </button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <X className="w-10 h-10" />
          </button>

          <div className="relative w-full h-full">
            <Image
              src={spaces[selectedImage].image}
              alt={spaces[selectedImage].title}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Navigation in Fullscreen */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {spaces.map((space, index) => (
              <button
                key={space.id}
                onClick={() => setSelectedImage(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedImage === index
                    ? "bg-white text-black"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {space.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
