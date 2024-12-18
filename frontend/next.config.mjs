/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true, // Enable strict mode for better error checking
  typescript: {
    ignoreBuildErrors: false, // Ensure TypeScript errors are not ignored
  },
};

export default nextConfig;
