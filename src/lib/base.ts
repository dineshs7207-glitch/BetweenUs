/**
 * Path prefix when the site is served from a sub-path (GitHub Pages serves it at
 * /BetweenUs). Empty in dev and on Vercel. next/link adds it automatically;
 * use withBase() for raw public-file paths (images, CSS masks, frames).
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const withBase = (p: string) => (p.startsWith("/") ? `${basePath}${p}` : p);
