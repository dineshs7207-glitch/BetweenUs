# Betwēn Us website: project handbook for Claude Code

This file is read automatically by Claude Code. It holds everything needed to
pick this project up cold: what it is, how it's built, what was decided and
why, what's left, and how to get it running.

- **Owner:** Dinesh Sarikonda (GitHub `dineshs7207-glitch`)
- **Repo:** https://github.com/dineshs7207-glitch/BetweenUs
- **Working branch:** `claude/loving-mccarthy-tw913v` (the default branch; there is no `main` yet. `gh-pages` holds only the built site)
- **Live site:** https://dineshs7207-glitch.github.io/BetweenUs/ (GitHub Pages via Actions)
- **Original spec:** [`docs/BRIEF.md`](docs/BRIEF.md). Treat it as the design source of
  truth for colours, fonts, copy, section order and behaviour. This file records what
  was actually built, including the deliberate deviations (section 9).

---

## 0. When the user says "start" (or opens a new session with no task)

Do these in order, briefly, then stop and ask:

1. **Read** this file fully, then skim `docs/BRIEF.md`, `README.md`, `REVIEW.md`,
   `src/lib/site.ts` and `src/data/menu.json` (just its shape).
2. **Check the branch:** `git status`, `git branch -a`, `git log --oneline -10`. If the
   work isn't on `main` yet, it lives on `claude/loving-mccarthy-tw913v`. Check whether
   that branch has been merged before building on it.
3. **Set up:** Node 20+ (`.nvmrc` says 22). Run `npm install` (or `npm ci`).
4. **Verify:** `npm run typecheck`, then `npm run build`. Both must pass with no
   errors or warnings.
5. **Run:** `npm run dev` (http://localhost:3000), or `npm run start` after a build.
   If you have a browser tool, load `/` and `/menu` and confirm there are no console
   errors. The hero film comes from Higgsfield's CDN (section 6); if your network
   blocks `d2ol7oe51mr4n9.cloudfront.net`, the hero shows its maroon arch with no film.
   That's an environment limit, not a bug.
6. **Report** in a few lines: the build state, what's running and where, and the top
   open items from section 10.
7. **Ask the user what they want to do next.** Suggested options: fill in café facts
   (hours, Swiggy/Zomato links, address), add real café photos, generate the dish
   photos in Higgsfield, self-host the hero film, deploy to Vercel, or a design change.

Don't start building, spend Higgsfield credits, push, or open PRs until the user says so.

---

## 1. What this is

A premium, motion-led marketing site for **Betwēn Us**, a café in **Kondapur,
Hyderabad** (opened 28 February 2026). Tagline (theirs): *For pauses and
conversations in betwēn.* It should feel like an Apple product page for a café:
scroll-driven storytelling, a cinematic hero film, a 3D drink, a white background
with vibrant colour moments. Visitors must reach the menu, ordering (Swiggy/Zomato),
calling or directions within two taps.

There are two pages:
- `/`: home. Sections in this order: intro loader → header → **hero film** → about
  line → **signature pours** (3D glass) → **field notes** → new signatures (Ube) →
  the room → private lounge → visit → footer.
- `/menu`: all 90 items, with tabs, chips, search, pagination and a dish sheet.

There are no prices, cart or payments (the café asked to leave prices out), and no
CMS or database. Ordering goes out to Swiggy and Zomato.

## 2. Tech stack (don't add packages without asking the user)

| Package | Version | Use |
|---|---|---|
| Next.js (App Router) | 14.2.x | pages, `next/image`, `next/font` |
| React / React DOM | 18.3.1 | React 18 because React Three Fiber v8 needs it |
| TypeScript | 5.6, strict | everything |
| Tailwind CSS | 3.4 | tokens in `tailwind.config.ts` + CSS vars in `globals.css` |
| GSAP + ScrollTrigger, @gsap/react | 3.12+ / 2.1 | hero scrub, pinned sections, colour changes, horizontal scroll |
| Lenis | 1.x | smooth scroll, driven by the GSAP ticker |
| Framer Motion | 11 | small UI motion: nav popover, dish sheet, grid, menu header tint |
| three, @react-three/fiber, @react-three/drei | 0.169 / 8.17 / 9.114 | 3D glass in signature pours |
| ffmpeg (local tool) | any | `npm run frames` (only for the frame-sequence fallback) |

The brief deliberately excludes Blender, Spline, a CMS, a DB and a cart.

## 3. Commands

```bash
npm install
npm run dev            # dev server :3000
npm run build          # production build (also lints + typechecks)
npm run start          # serve the build
npm run typecheck      # tsc --noEmit
npm run prompts        # writes scripts/higgsfield-prompts.json (one prompt per dish w/o photo)
npm run frames -- hero.mp4 30 1600   # video → public/hero/frames (fallback hero mode)
npm run hero:self-host # copy hero film/posters from Higgsfield CDN into public/hero + rewrite site.ts
npm run build:pages    # static export into ./out, served under /BetweenUs (what GitHub Pages runs)
```

**Live site (GitHub Pages):** https://dineshs7207-glitch.github.io/BetweenUs/
Deployed by `.github/workflows/deploy-pages.yml` on every push to
`claude/loving-mccarthy-tw913v` or `main` (or run it manually from the Actions tab).
The workflow typechecks, builds with `STATIC_EXPORT=1` and
`NEXT_PUBLIC_BASE_PATH=/BetweenUs`, and force-pushes `./out` to the **`gh-pages`
branch**; GitHub Pages serves that branch (Pages source = "Deploy from a branch",
gh-pages / root). Never edit `gh-pages` by hand: it's regenerated on every deploy.
(The workflow token can't switch Pages on by itself; Pages was switched on by the
first push of `gh-pages`.) Because the site lives under
a sub-path, **any raw public-file path (img src, CSS url, video src) must go through
`withBase()` from `src/lib/base.ts`**; `next/link` hrefs are prefixed automatically.

Alternative host, Vercel: import the repo, the framework is auto-detected, no env vars are
needed (optionally set `NEXT_PUBLIC_SITE_URL` for OG links). Vercel deploys `main` by
default, so either merge the branch or set the production branch in Vercel.

## 4. Where everything lives

```
src/
  app/
    layout.tsx        fonts (Outfit 200–500, Instrument Serif), metadata, JSON-LD, Nav + Footer + SmoothScroll
    page.tsx          home: section order; checks which optional photos exist (server-side) and passes src|null
    menu/page.tsx     menu: lists /public/menu files at build time → MenuBrowser
    globals.css       colour tokens as RGB CSS vars (+ dark mode), mask classes, Lenis CSS, marquee keyframes
    icon.png, apple-icon.png, opengraph-image.png   clay BB on maroon (generated from monogram.png)
  components/
    SmoothScroll.tsx  Lenis + ScrollTrigger sync; exports lockScroll(bool) (counted) and scrollToTarget()
    Loader.tsx        intro curtain; once per session; waits for hero-progress; 9 s cap; "Skip intro"
    Nav.tsx           fixed header; transparent only at the top of "/"; Order popover; mobile panel
    Monogram.tsx      <Monogram> (CSS mask of public/brand/monogram.png) and <Wordmark> (text, see §9)
    Hero.tsx          "Betwēn [arch] us" pinned scroll scene; plays the film (or frames, or the coded pour)
    Intro.tsx         about line
    SignaturePours.tsx + GlassScene.tsx   six drinks, pinned + snapped, bg/text colour tween, R3F glass
    FieldNotes.tsx    café "Field Notes" cards; pinned horizontal scroll ≥900px
    NewSignatures.tsx Ube collection (café's "Purple Dream" poster)
    TheRoom.tsx       two marquee photo strips + "Pause photos" button
    Lounge.tsx, Visit.tsx, Footer.tsx, OrderButtons.tsx
    Photo.tsx         image, or a branded tinted tile when src is null
    menu/             MenuBrowser (URL state, filters, search, grid, pagination), DishImage, DishSheet, DietMark
  data/menu.json      categories[] + items[] (90 items). Edit menu text here only.
  lib/
    site.ts           ALL café facts + hero film URLs + TODOs. Edit facts here only.
    drinks.ts         six signature drinks: name, description, bg, fg, 3 liquid layers, ice flag
    menu.ts           types, filtering (accent-insensitive), group tints, PAGE_SIZE=12
    gallery.ts        café still file names + alt text (room rows, lounge, visit)
    gsap.ts           registers ScrollTrigger + useGSAP once; ignoreMobileResize; prefersReducedMotion()
    pour.ts           coded canvas espresso pour (last-resort hero fallback)
    assets.ts         server-side fs helpers: which files exist in /public
public/
  brand/monogram.png  white-on-transparent BB (820:1050), cut from the Achari poster
  dishes/achari-caesar-salad.webp   real poster crop
  gallery/ube-collection.webp       real poster crop
  hero/frames/, menu/, video/       empty (.gitkeep), waiting for assets
scripts/              extract-frames.sh, make-higgsfield-prompts.mjs, higgsfield-prompts.json, self-host-hero.mjs
docs/BRIEF.md         original spec
README.md             human-facing setup + asset guide
REVIEW.md             visitor review by age group (first pass)
```

## 5. Design system (summary; full values in docs/BRIEF.md §2)

- Colours: porcelain `#FFFDF9` (bg), oat `#F6EEE3`, ink `#2A1714`, maroon `#5A1A14`,
  maroon-deep `#3D100C`, loader `#5D1E17`, clay `#C49A7E`, leaf `#2F5D3A`, teal `#1F6E6A`.
  These are defined as RGB CSS vars in `globals.css` so Tailwind alpha works
  (`bg-maroon/85`). Dark mode swaps porcelain/ink/maroon; fixed-colour sections use the
  `.fixed-palette` class to keep their light values.
- Fonts: Outfit (200 for big headings) for everything; Instrument Serif italic only
  for accents (drink descriptions, tagline second line, Observed effects, footer).
- Shapes: the arch `border-radius: 999px 999px 26px 26px`; cards 20–28px; pills ≥44px tall.
- Copy voice: short, warm, a little dry, sentence case, no exclamation marks, no
  all-caps eyebrows, no arrows on buttons. Always spell the name **Betwēn Us** (with ē);
  use "betwen" in URLs, file names and alt text.

## 6. The hero film (how it was made, and how to redo it)

The user rejected the first coded animation and asked for a Higgsfield-generated
cinematic hero, with the Betwēn Us logo on the cup, inspired by a reference reel
(beans pouring into a speckled cup → latte art, overhead, warm stone). The reference
was another café's reel (@brixcafe.ae), so **none of its frames were reused**; an
original was generated using the **scroll-world** skill's method
(https://github.com/dineshs7207-glitch/scroll-world): frame-locked keyframes →
video between them → scroll-scrubbed `<video>`.

**Pipeline (Higgsfield, via the Higgsfield MCP connector):**
1. Logo reference: `src/app/icon.png` imported by its raw GitHub URL (media id `f7f243b0-50e3-44f1-abb7-60e2a5b0c560`).
2. Stills with `gpt_image_2_6`, quality high, 2k (2.75 credits each):
   - Desktop 16:9 start, job `a41d15e1-91bd-4789-9b9a-25b0e6db8432`: high ~60° angle, warm cream limestone,
     speckled cream ceramic mug centred with the maroon BB monogram on the front, a cascade of roasted beans
     falling into it, soft daylight from the upper left.
   - Desktop 16:9 end, job `fc63bc4c-8715-47ac-ad19-31144f7756ea`: an edit of the start ("same everything"), with
     the beans gone, a rosetta latte in the mug, and steam.
   - Phone 9:16 start, job `ccdaf814-96c4-4058-9235-285121cacba7`; phone 9:16 end, job `ff51b145-d8f9-4066-a9a0-346516986344`
     (recomposed vertically, mug in the lower-middle).
3. Films with `kling3_0`, mode `pro`, 8 s, sound off, start_image + end_image (14 credits each):
   - 16:9 job `72974ee3-f711-42aa-afee-c8c111f35bc9`; 9:16 job `c0e32146-6eb9-478b-b426-a0d579d312ec`.
   - Prompt essence: single continuous shot, locked-off camera with a slow push-in; beans pour
     into the mug, melt into espresso, crema blooms, milk draws a rosetta, steam rises;
     the monogram stays sharp; no hands, text or watermark.
   - Seedance 2.5 was priced at 128 credits (1080p) / 56 (720p) for 8 s, so Kling 3.0 Pro (14) was chosen.
4. Encoded in Higgsfield's sandbox for scrubbing (`-an`, light unsharp, `-g` small, faststart):
   - Desktop: 1440px wide, crf 25, `-g 6`, **4.4 MB**
   - Phone: 720×1274, crf 27, `-g 6`, **3.1 MB**
   - Posters: first frame of each, as JPG.
5. Uploaded to Higgsfield storage; the URLs are in `site.hero.video` in `src/lib/site.ts`
   (host `d2ol7oe51mr4n9.cloudfront.net`, which serves CORS OK and is seekable).

Total spent on the hero: **39 credits** (balance after: 157.5).

**How `Hero.tsx` plays it:** it fetches the film as a Blob (always seekable, and
reports download progress to the Loader through the `hero-progress` event), falling
back to a direct `src` if the fetch fails. A rAF loop lerps `currentTime` toward the
scroll progress and never seeks while `video.seeking` (seek coalescing). It primes
playback on the first touch for iOS and picks the mobile film/poster when the pointer
is coarse or the width is ≤860px. The GSAP timeline pins the section (`end: +=260%`,
`scrub: 0.6`): the words slide out (5–50%), the arch grows to full screen (12–62%),
the shade fades in (55%) and the tagline rises (62%). On phones under 640px the film
is lifted 16vh while the arch is narrow, so the BB monogram shows, then it settles.
Reduced motion shows the arch full screen on the last frame with the tagline.

**Fallback order:** `site.hero.video` → frames (`hero.frameCount > 0`) → coded pour (`lib/pour.ts`).

**Known gap:** the films are on Higgsfield's CDN, not in the repo, because the build
session's network blocked that host. Run `npm run hero:self-host` from a normal
machine to copy them into `public/hero/` and rewrite `site.ts` to local paths, then commit.

## 7. Other content decisions

- **Menu** (`menu.json`): transcribed word for word from the café's printed menu photos
  (90 items: coffee 44, kitchen 30, desserts 16). Spelling fixes: Romensco→Romesco,
  Macrons→Macarons, coles law→coleslaw, siracha→sriracha, "chicken mutton breast"→"chicken
  breast". Protein options: Asian rice bowls + noodles (Paneer, Egg, Chicken, Prawns, Mix),
  pasta (Mushroom, Chicken, Prawns), Stroganoff (Mushroom, Chicken), Betwēn Us Bowl (Chicken,
  Paneer). Desserts carry `diet: veg|nonveg` from the printed menu's green/red marks.
  Bharwan Paneer Tikka, Kung Pao Rice Bowl and the three mango desserts have empty
  descriptions (TODO). Achari Caesar: "Our Caesar, reinvented with an Indian twist. With chicken." (from the café's poster).
- **Signature pours:** six drinks with exact colours from the brief. The 3D glass:
  the liquids render after the glass's back wall (`renderOrder`), and the front wall is a
  thin 0.08 sheen, so the drink colours read true (at the brief's single 0.22 white
  wall, the dark layers looked grey).
- **Ube collection** section: added from the café's "Purple Dream" poster (not in the
  brief). The drink names are unknown, so they aren't on the menu.
- **Photos:** 14 real café stills (cut from the café's own reels) are in `public/gallery`
  (names in `lib/gallery.ts`), and five real poster crops are in `public/dishes` for the Field
  Notes cards. The 90 dish photos were generated in Higgsfield (`gpt_image_2_6`, cream
  backdrop style) and their URLs live in `scripts/photo-sources.json`; the deploy workflow
  runs `npm run photos`, which downloads them into `public/menu/<slug>.webp` and commits
  them back, so they end up self-hosted in the repo. Any slot without a file still renders
  a branded tinted tile. `page.tsx` and `menu/page.tsx`
  check which files exist at build time, so missing photos never 404.
- **Swiggy/Zomato:** these currently link to a search on each site (TODO: the real listing URLs).

## 8. Accessibility, motion, performance

- One h1 per page (the hero's is visually hidden), a skip link, 44px targets, a 2px maroon
  focus ring, aria-live counts, a dialog with focus trap, Escape and focus return,
  `aria-hidden` on the canvas/3D/film.
- Reduced motion: no Lenis, no pinning, no marquee, a static hero end frame, the first drink, a quick loader.
- The 3D glass mounts only near the viewport (IntersectionObserver) with DPR [1, 1.75].
- Budgets: hero film ≤5 MB per device; dish images ≤1000px WebP.

## 9. Deliberate deviations from docs/BRIEF.md

| Brief | Built | Why |
|---|---|---|
| Hero words 13vw on all widths | 13vw on phones, 9.6vw from 640px | At 13vw "Betwēn" is wider than the space beside a centred arch and overlapped it |
| Hero = WebP frame sequence on canvas | Scroll-scrubbed `<video>` (frames + coded pour kept as fallbacks) | The user asked for a Higgsfield cinematic film; scroll-world technique |
| Glass: one wall at opacity 0.22 | Back wall 0.22 + front sheen 0.08 | Dark drink layers looked grey |
| Header transparent at top everywhere | Solid on `/menu` and under reduced motion | Contrast over the coloured band / dark hero |
| Wordmark PNG mask | Text in Outfit with wide tracking | No clean wordmark file was available |
| Intro film `logo-pour.mp4` | Coded monogram "pour fill" until the file exists | File not provided |
| No Ube section | Ube "Purple Dream" section | The user supplied the café's poster |
| Not specified | Veg/non-veg marks; "Pause photos" button | From the printed menu; WCAG pause control |
| Dark mode swap | Always the light porcelain theme | The owner wants a bright white site; dark mode made it brown |
| Signature pours snap per drink | Free scroll, 0.55 viewport per drink, text never fades out | Snapping felt like the page was fighting the wheel and the drink name vanished mid-change |
| Hero pin `+=260%` | `+=180%`, Lenis lerp 0.14 | The long video scrub felt heavy and laggy |

## 10. Open items / next steps (ask the user before acting)

From the café (all TODO in `src/lib/site.ts` / `menu.json`):
- Swiggy and Zomato listing URLs; opening hours; full street address
- Is Summer Madness still on? Descriptions for Mangomisu, Mango Mousse, Mango Tart
- Descriptions for Bharwan Paneer Tikka and Kung Pao Rice Bowl
- Is wood-fire pizza on the menu? Lounge capacity? (Prices stay off by request)
- The four Ube drink names, if they should be added to the menu

Assets:
- Real café photos (names in `lib/gallery.ts`) and the Field Notes poster crops (`public/dishes/*`)
- `logo-pour.mp4` (intro) and `wordmark.png`
- ~89 dish photos: `npm run prompts`, then generate in Higgsfield `gpt_image_2_6` 1:1 and save as
  `public/menu/<slug>.webp` (≈0.25–2.75 credits each depending on quality; **ask before spending**)

Engineering:
- `npm run hero:self-host` and commit (removes the CDN dependency)
- Optionally create `main` from `claude/loving-mccarthy-tw913v`; run Lighthouse on mobile against the live Pages URL
  (targets: Perf 85+, A11y 95+, BP 95+, SEO 95+), test on a real iPhone and Android phone
- Optional: a REVIEW.md second pass after the real photos land

## 11. Working rules for Claude Code in this repo

- Follow `docs/BRIEF.md` for values; record any new deviation in section 9 of this file.
- Never invent prices, hours, capacities, dish descriptions or links; leave TODOs and tell the user.
- Ask before adding any package not in section 2, and before spending Higgsfield credits
  (quote the cost with `get_cost` first).
- Keep café facts in `site.ts` and menu text in `menu.json`; components stay data-free.
- Before committing: `npm run typecheck` and `npm run build` must pass with no warnings.
- Keep this file current: when you finish meaningful work, update sections 6–10.
