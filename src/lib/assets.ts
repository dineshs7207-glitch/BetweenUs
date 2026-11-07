import fs from "node:fs";
import path from "node:path";

/**
 * Lists which optional images exist in /public at build time, so components
 * can show branded placeholders instead of requesting files that 404.
 */
export function listPublic(dir: string): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), "public", dir))
      .filter((f) => /\.(webp|jpe?g|png|avif)$/i.test(f));
  } catch {
    return [];
  }
}

export function publicFileExists(rel: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", rel.replace(/^\//, "")));
}
