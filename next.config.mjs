/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The marketing page is injected HTML and the command app is mounted client-side;
  // don't fail the production build on lint findings in that legacy-style code.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
