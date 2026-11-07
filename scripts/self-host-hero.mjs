// Copies the hero film + poster from the Higgsfield CDN into public/hero/ and
// points src/lib/site.ts at the local copies, so the site no longer depends
// on an external host. Run: node scripts/self-host-hero.mjs
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const sitePath = path.join(root, "src/lib/site.ts");
let site = fs.readFileSync(sitePath, "utf8");

const urls = [...site.matchAll(/"(https:\/\/[^"]+\.cloudfront\.net\/[^"]+)"/g)].map((m) => m[1]);
if (!urls.length) {
  console.log("No CDN URLs in site.ts; nothing to do.");
  process.exit(0);
}

const outDir = path.join(root, "public/hero");
fs.mkdirSync(outDir, { recursive: true });

for (const url of urls) {
  const name = path.basename(new URL(url).pathname);
  const local = `/hero/${name}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(path.join(outDir, name), Buffer.from(await res.arrayBuffer()));
  site = site.replaceAll(url, local);
  console.log(`saved ${local}`);
}
fs.writeFileSync(sitePath, site);
console.log("Updated src/lib/site.ts to use the local files.");
