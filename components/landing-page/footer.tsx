'use client';

import Link from 'next/link';
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Studios', href: '#studios' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    { name: 'Content Creation', href: '#services' },
    { name: 'Podcast Studio', href: '#services' },
    { name: 'Photography', href: '#services' },
    { name: 'Video Production', href: '#services' },
    { name: 'Post-Production', href: '#services' },
    { name: 'Collaboration Space', href: '#services' },
  ];

  const socialLinks = [
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Facebook', icon: FaFacebook, href: '#' },
    { name: 'YouTube', icon: FaYoutube, href: '#' },
    { name: 'TikTok', icon: FaTiktok, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              TRUE MEDIA
            </h3>
            <p className="text-gray-400 text-sm">
              Toronto&apos;s Premier Content Creation Hub
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link 
                    href={service.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2023 TRUE MEDIA STUDIOS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}