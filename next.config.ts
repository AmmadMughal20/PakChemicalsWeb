import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // replace with actual domain
        port: '', // leave empty unless you have a custom port
        pathname: '/**', // allow all paths
      },
    ]
  }
};

export default nextConfig;
