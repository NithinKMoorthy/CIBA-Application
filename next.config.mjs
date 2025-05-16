/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // This allows production builds to successfully complete even if
      // there are ESLint errors (e.g., react/no-unescaped-entities)
      ignoreDuringBuilds: true,
    },
  };
  
  export default nextConfig;
  