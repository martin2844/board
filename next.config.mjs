/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["knex"],
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb', // Keep original limit, handle large files with middleware
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "s3.c5h.dev",
      },
    ],
  },
};

export default nextConfig;
