/**
 * Two build targets:
 * - default (Vercel / `npm run start`): normal Next.js server build
 * - STATIC_EXPORT=1 (GitHub Pages): static HTML in ./out, served under
 *   NEXT_PUBLIC_BASE_PATH (e.g. /BetweenUs), images unoptimized
 */
const staticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(staticExport && {
    output: "export",
    trailingSlash: true,
    basePath: basePath || undefined,
  }),
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
