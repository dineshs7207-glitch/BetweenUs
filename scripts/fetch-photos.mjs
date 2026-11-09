// Downloads the Higgsfield dish photos listed in scripts/photo-sources.json
// into public/menu/<slug>.webp (resized WebP, ≤900px). Skips files that already exist.
// Runs in GitHub Actions before the build; also works locally: `npm run photos`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const { menu } = JSON.parse(fs.readFileSync(path.join(root, "scripts/photo-sources.json"), "utf8"));
const outDir = path.join(root, "public/menu");
fs.mkdirSync(outDir, { recursive: true });

const hasFfmpeg = (() => { try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); return true; } catch { return false; } })();
let ok = 0, skipped = 0, failed = 0;

for (const [slug, url] of Object.entries(menu)) {
  const out = path.join(outDir, `${slug}.webp`);
  if (fs.existsSync(out)) { skipped++; continue; }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (hasFfmpeg) {
      const tmp = path.join(outDir, `${slug}.src.png`);
      fs.writeFileSync(tmp, buf);
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", tmp, "-vf", "scale='min(900,iw)':-2", "-quality", "80", out]);
      fs.unlinkSync(tmp);
    } else {
      // Fallback: Higgsfield's own small WebP version
      const small = await fetch(url.replace(/\.png$/, "_min.webp"));
      if (!small.ok) throw new Error(`HTTP ${small.status}`);
      fs.writeFileSync(out, Buffer.from(await small.arrayBuffer()));
    }
    ok++;
  } catch (e) {
    failed++;
    console.warn(`photo ${slug}: ${e.message}`);
  }
}
console.log(`menu photos: ${ok} downloaded, ${skipped} already present, ${failed} failed`);
