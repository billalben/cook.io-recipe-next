import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edamam-product-images.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.edamam.com",
      },
    ],
  },
};

export default nextConfig;
