/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ygqwpbqselzzuqsismbo.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/cabin-images/**",
      },
    ],
  },
  // output: "export",
};

export default nextConfig;
