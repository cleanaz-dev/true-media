'use client';

import { Video, Mic, Camera, Film, Scissors, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BlueLine from '../ui/BlueLine';

export default function OurServices() {
  const services = [
    {
      icon: Video,
      title: 'Content Creation',
      description: 'Full-service content creation support for YouTubers, TikTok influencers, and digital creators across all platforms.'
    },
    {
      icon: Mic,
      title: 'Podcast Studio',
      description: 'Professional podcast recording studios with industry-grade equipment and soundproofing for crystal-clear audio.'
    },
    {
      icon: Camera,
      title: 'Photography',
      description: 'State-of-the-art photography studios with professional lighting setups for commercial and creative shoots.'
    },
    {
      icon: Film,
      title: 'Video Production',
      description: 'Complete video production facilities with green screens, lighting, and versatile shooting spaces.'
    },
    {
      icon: Scissors,
      title: 'Post-Production',
      description: 'Advanced editing suites with professional software and hardware for video and audio post-production.'
    },
    {
      icon: Users,
      title: 'Collaboration Space',
      description: 'Dedicated spaces for creators to network, collaborate, and develop innovative content together.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
             <BlueLine width="w-16" className="mb-4" />
          <p className="text-xl text-gray-600">
            Professional solutions for content creators
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}