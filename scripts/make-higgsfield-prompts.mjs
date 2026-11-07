// Writes scripts/higgsfield-prompts.json: one GPT Image 2.6 prompt per dish
// that has no real photo yet. Run with `npm run prompts`.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const menu = JSON.parse(fs.readFileSync(path.join(root, "src/data/menu.json"), "utf8"));
const cats = Object.fromEntries(menu.categories.map((c) => [c.id, c]));

const STYLE =
  "Editorial food photograph for Betwēn Us café, Hyderabad. Shot from a 45 degree angle on handmade sand-coloured stoneware, warm white linen surface, soft window daylight from the left, shallow depth of field, natural colours, a small edible flower garnish, no text, no logos, no hands, square 1:1 composition.";

const VESSEL = {
  coffee: "in a ceramic cup or a clear takeaway tumbler as suits the drink",
  kitchen: "plated in a wide stoneware bowl or plate",
  desserts: "on a small dark slate or stoneware plate",
};

const existing = new Set(
  fs.existsSync(path.join(root, "public/menu"))
    ? fs.readdirSync(path.join(root, "public/menu")).map((f) => f.replace(/\.[a-z]+$/i, ""))
    : [],
);

const prompts = menu.items
  .filter((it) => !it.img && !existing.has(it.slug))
  .map((it) => {
    const cat = cats[it.category];
    const desc = it.description || cat?.note || "";
    return {
      slug: it.slug,
      file: `public/menu/${it.slug}.webp`,
      model: "gpt_image_2_6",
      aspect_ratio: "1:1",
      prompt: `${it.name}${desc ? `: ${desc.replace(/\.$/, "")}` : ""}, ${VESSEL[it.group]}. ${STYLE}`,
    };
  });

const out = path.join(root, "scripts/higgsfield-prompts.json");
fs.writeFileSync(out, JSON.stringify(prompts, null, 2) + "\n");
console.log(`Wrote ${prompts.length} prompts to ${path.relative(root, out)}`);
