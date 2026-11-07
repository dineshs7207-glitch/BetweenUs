# Betwēn Us

Website for Betwēn Us, a café in Kondapur, Hyderabad. *For pauses and conversations in betwēn.*

Next.js 14 (App Router, TypeScript, Tailwind), GSAP + ScrollTrigger, Lenis, Framer Motion and
React Three Fiber. The full build brief is in [`CLAUDE.md`](CLAUDE.md).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

Deploy: import the repository on Vercel (framework auto-detected, no environment variables).
Optionally set `NEXT_PUBLIC_SITE_URL` to the final domain for Open Graph links.

## Where things live

| What | File |
| --- | --- |
| Café facts (phone, Instagram, hours, order links, hero frame count) | `src/lib/site.ts` |
| All 90 menu items, word for word from the printed menu | `src/data/menu.json` |
| The six signature drinks (colours, liquid layers, ice) | `src/lib/drinks.ts` |
| Café stills used in The room / lounge / visit | `src/lib/gallery.ts` + `public/gallery/` |

## Adding the real visuals

Everything degrades gracefully: any photo that isn't in `public/` yet shows a branded tile, so
you can drop files in one at a time and redeploy.

- **Café photos**: save as `public/gallery/<name>.webp` using the names in `src/lib/gallery.ts`
  (dining-hall, planter-booths, staircase, teal-corner, arched-window, main-floor, coffee-bar,
  espresso-machine, garden-terrace, pendant-wall, balcony, wood-fire-oven, arches-night, lounge).
- **Field Notes posters**: `public/dishes/<slug>.webp` (bharwan-paneer-tikka, kung-pao-rice-bowl,
  spinach-green-chilli-pasta, summer-mango-desserts). achari-caesar-salad is already in.
- **Dish photos**: `npm run prompts` writes `scripts/higgsfield-prompts.json` (one GPT Image 2.6
  prompt per dish). Save results as `public/menu/<slug>.webp` (≤1000px, quality ~80).
- **Hero video**: generate in Higgsfield (prompt in CLAUDE.md §5), save as `hero.mp4` in the
  project root, run `npm run frames -- hero.mp4 30 1600`, then set `hero.frameCount` in
  `src/lib/site.ts` to the printed count. Until then the hero draws a coded espresso pour.
- **Intro film**: put `logo-pour.mp4` in `public/video/` and set `intro.video` in
  `src/lib/site.ts` to `"/video/logo-pour.mp4"`. Until then the intro is a coded monogram pour.
- **Wordmark**: the "Betwēn us" wordmark is set in Outfit for now; swap in the cut
  `public/brand/wordmark.png` mask when available.

## Open items to confirm with the café (TODO in code)

- Swiggy and Zomato listing links (`site.order`; currently a search on each site)
- Opening hours (`site.hours`) and full street address (`site.address`)
- Is Summer Madness still running? Descriptions for Mangomisu, Mango Mousse, Mango Tart
- Descriptions for Bharwan Paneer Tikka and Kung Pao Rice Bowl
- "Ceylon Grilled Chicken" description changed from "chicken mutton breast" to "chicken breast"
- Is wood-fire pizza on the menu? Lounge capacity? Prices are left out by request
- Names of the four Ube collection drinks, if they should go on the menu
