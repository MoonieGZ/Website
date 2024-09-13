/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    API_URL: process.env.API_URL,
    ENVIRONMENT: process.env.NODE_ENV,
  }
}

export default nextConfig