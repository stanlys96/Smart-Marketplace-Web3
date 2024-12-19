/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["gateway.pinata.cloud"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // Avoid issues with ESM modules
      },
    });
    return config;
  },
};

export default nextConfig;
