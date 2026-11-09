// Downloads the Higgsfield images listed in scripts/photo-sources.json:
//   menu   → public/menu/<slug>.webp   (dish photos, ≤900px)
//   drinks → public/drinks/<slug>.webp (transparent cut-outs for Signature pours, ≤1000px, alpha kept)
// Skips files that already exist. Runs in GitHub Actions before the build; locally: `npm run photos`.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const sources = JSON.parse(fs.readFileSync(path.join(root, "scripts/photo-sources.json"), "utf8"));
const hasFfmpeg = (() => {
  try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); return true; } catch { return false; }
})();

const jobs = [
  { map: sources.menu ?? {}, dir: "public/menu", width: 900, alpha: false },
  { map: sources.drinks ?? {}, dir: "public/drinks", width: 1000, alpha: true },
];

let ok = 0, skipped = 0, failed = 0;
for (const { map, dir, width, alpha } of jobs) {
  const outDir = path.join(root, dir);
  fs.mkdirSync(outDir, { recursive: true });
  for (const [slug, url] of Object.entries(map)) {
    const out = path.join(outDir, `${slug}.webp`);
    if (fs.existsSync(out)) { skipped++; continue; }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (hasFfmpeg) {
        const tmp = path.join(outDir, `${slug}.src.png`);
        fs.writeFileSync(tmp, buf);
        const args = ["-y", "-loglevel", "error", "-i", tmp, "-vf", `scale='min(${width},iw)':-2`];
        if (alpha) args.push("-c:v", "libwebp", "-pix_fmt", "yuva420p", "-lossless", "0", "-quality", "86");
        else args.push("-quality", "80");
        args.push(out);
        execFileSync("ffmpeg", args);
        fs.unlinkSync(tmp);
      } else if (!alpha) {
        const small = await fetch(url.replace(/\.png$/, "_min.webp"));
        if (!small.ok) throw new Error(`HTTP ${small.status}`);
        fs.writeFileSync(out, Buffer.from(await small.arrayBuffer()));
      } else {
        fs.writeFileSync(out.replace(/\.webp$/, ".png"), buf);
      }
      ok++;
    } catch (e) {
      failed++;
      console.warn(`${dir}/${slug}: ${e.message}`);
    }
  }
}
console.log(`photos: ${ok} downloaded, ${skipped} already present, ${failed} failed`);
