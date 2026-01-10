/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
   images: {
    domains: ["res.cloudinary.com"], 
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
};

export default nextConfig;
