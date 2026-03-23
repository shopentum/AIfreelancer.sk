import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.aifreelancer.sk" }],
        destination: "https://aifreelancer.sk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
