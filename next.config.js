/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
 
  images: {
    domains: ['dc-hangman-app.s3.amazonaws.com'],
  },
  
}

module.exports = nextConfig
