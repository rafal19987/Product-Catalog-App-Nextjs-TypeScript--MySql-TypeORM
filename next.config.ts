import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
  serverExternalPackages: ['typeorm', 'mysql2'],
};

export default nextConfig;
