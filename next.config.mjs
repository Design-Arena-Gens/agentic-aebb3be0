/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {},
    },
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;
