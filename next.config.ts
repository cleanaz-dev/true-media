import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dmllgn0t7/**', // scope it to your cloud name, or use '/**' for any path
      },
    ],
  },
  allowedDevOrigins: [
    'lvh.me'
  ]
};

export default nextConfig;
