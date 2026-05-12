/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // Khi Frontend gọi đến /api/proxy/...
        source: '/api/proxy/:path*',
        // Next.js sẽ âm thầm gọi đến địa chỉ IP thật này
        destination: `${process.env.API_URL}/:path*`,
      },
    ]
  },
};

module.exports = nextConfig;