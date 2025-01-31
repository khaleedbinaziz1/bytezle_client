/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['sandbox.sslcommerz.com', 'i.ibb.co', 'i.ibb.co.com', 'localhost', 'firebasestorage.googleapis.com'],
  },
  // experimental: {
  //   concurrentFeatures: true,
  // },
};

export default nextConfig;
