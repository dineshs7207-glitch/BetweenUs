<!-- Original build brief (spec). Source: the "Betwēn Us website: Claude Code build prompt" doc. Where this differs from CLAUDE.md, CLAUDE.md records what was actually built and why. -->
# Betwēn Us website: Claude Code build prompt
2026-11-06 · Dinesh Sarikonda

## 1. How to use this prompt
Build a premium, motion-led website for Betwēn Us, a café in Kondapur, Hyderabad, as a Next.js app deployed on Vercel. Paste this whole document into Claude Code as the brief, or save it as `CLAUDE.md` in the project root so Claude Code reads it every session.
Instructions to Claude Code (copy this paragraph first):

You are building the Betwēn Us café website described in this document. Follow every value in it exactly: colours, fonts, copy, file paths and section order. Work in the phases in section 10, one phase at a time. After each phase, run `npm run build` and `npm run dev`, fix every error and warning, and show me what changed before starting the next phase. Never invent prices, opening hours, capacities, dish descriptions or links: if a fact is missing, use the TODO placeholder from section 11 and tell me. Ask me before adding any library not listed in section 3. Ask me before spending Higgsfield credits.
Goal and quality bar

Feels like an Apple product page made for a café: scroll-driven storytelling, a 3D drink, smooth motion, white background, vibrant colour moments.

Fast on a mid-range Android phone over 4G: hero playable within 3 seconds, Lighthouse Performance 85+ on mobile, Accessibility 95+.

Every visitor can find the menu, order online, call, or get directions within two taps from any screen.

Real café photos and real menu text throughout. AI images only for dishes without a real photo.
Starting point. A first version of this codebase exists as `betwen-us.zip` (Next.js 14, all sections and the menu page built). If you have it, unzip it and treat this document as the spec to finish, fix and polish it. If not, build from scratch with this document.

## 2. Brand and design system
The base is a bright porcelain white with the café's own maroon as the main colour; vibrant colour appears only where a drink takes over the screen. Spend boldness in one place (the colour-changing drinks section) and keep everything else quiet.
Core colours (define as Tailwind theme colours and CSS variables)
Token
Hex
Use
porcelain
#FFFDF9
Page background everywhere
oat
#F6EEE3
Hover fills, chips, empty states
ink
#2A1714
Body text
maroon
#5A1A14
Headings, buttons, logo, links (from the logo background)
maroon-deep
#3D100C
Button hover, lounge section background
loader maroon
#5D1E17
Intro screen background (matches the logo film)
clay
#C49A7E
Monogram accent, footer text (from the logo's BB)
leaf
#2F5D3A
Kitchen menu header (the café's plants)
teal
#1F6E6A
Accent (the café's teal chairs)
Text on porcelain uses ink at 100%, 75% for secondary text and 55–60% for labels. Never use pure black.
Drink colours (signature section; background and text switch per drink)
Drink
Background
Text
Liquid layers, bottom to top
Orange Cold Brew
#F27A1D
#2E1004
#FFA43A 42%, #4A2512 36%, ice
Cranberry Cold Brew
#A8102F
#FFF1EE
#D21E45 48%, #3B1B10 32%, ice
Midnight Mocha
#3C1F5E (purple)
#F3EAFE
#24120C 50%, #4A2618 24%, foam #D8C3AE 8%
Coconut Cold Brew
#1F6E6A
#EFFFFC
#F4EFE6 40%, #5B3420 40%, ice
Biscoff Latte
#B5652A
#FFF6EC
#E6CBA8 52%, #7A4424 20%, foam #F3E3CF 8%
Betwēn Us Latte
#5A1A14
#F6EEE3
#EAD9C2 50%, #8A5532 16%, foam #FFFFFF 12%
Menu page header tints: Everything #5A1A14, Coffee #8A4B26, Kitchen #2F5D3A, Desserts #9C2F45 (text #FFF4E8 / #F1F7EC / #FFF0F2 / #F6EEE3). Placeholder dish tiles: coffee #F3E6D8, kitchen #E7EEDF, desserts #F7E3E0.
Dark mode: keep the light design as the default. If the visitor's phone is in dark mode, swap porcelain to #1A0E0B, ink to #F4E9DE and maroon text/buttons to #EDBBA6 with #2A1714 button text. Fixed-colour sections (signature drinks, lounge, footer, field-note cards) stay as they are.
Typography (load with `next/font/google`)

Outfit (weights 200, 300, 400, 500): everything. It matches the geometric, widely spaced "Betwēn us" wordmark. Big headings use weight 200 (extralight) with slight negative tracking; the hero words use letter-spacing 0.04em.

Instrument Serif (regular and italic): only for italic accents: drink descriptions, the tagline's second line, "Observed effects" notes, footer tagline. Never for body text.

Scale: hero words clamp(40px, 13vw, 220px); section titles clamp(40px, 5.4vw, 84px); drink names clamp(44px, 7vw, 104px); body 18px with 1.6–1.7 line-height; labels 14–15px. Keep line length under 80 characters.

Avoid: all-caps eyebrow labels, one highlighted word in a heading, arrows appended to buttons.
Logo usage

Two assets: the BB monogram and the "Betwēn us" wordmark, both cut from the logo file as white-on-transparent PNGs and used as CSS masks so they take any colour (`background-color: currentColor` + `mask-image`). Monogram ratio 820:1050, wordmark 2416:394.

Always spell the name Betwēn Us (with ē) in visible text. In URLs, file names and alt text use "betwen".

Header: monogram 36px tall + wordmark 17px tall, maroon. Footer: clay monogram, porcelain wordmark on maroon.
Shapes

The arch is the signature shape (the café has arched windows): `border-radius: 999px 999px 26px 26px`. Used for the hero window and the lounge photo.

Cards and photos: 20–28px radius. Buttons and chips: fully rounded pills, minimum 44px tall.
Voice of the copy: short, warm and a little dry, like the café's own "Field Notes" posts. Plain words, sentence case, no exclamation marks. Tagline (theirs): For pauses and conversations in betwēn.

## 3. Tech stack and tools
The site is Next.js 14 with TypeScript and Tailwind; GSAP drives scroll scenes, Three.js draws the 3D glass, and Higgsfield makes every AI image and video. Use only the packages below.
Tool
Version
Used for
Next.js (App Router)
^14.2.25
Pages, routing, image optimisation, fonts
React / React DOM
18.3.1
UI components (React 18 because React Three Fiber v8 needs it)
TypeScript
^5.6
All code, strict mode
Tailwind CSS
^3.4
Styling, design tokens in `tailwind.config.ts`
GSAP + ScrollTrigger
^3.12.5
Hero frame scrubbing, pinned sections, colour changes, horizontal scroll
@gsap/react
^2.1
`useGSAP` hook with automatic cleanup
Lenis
^1.1
Smooth scrolling, synced to ScrollTrigger
Framer Motion
^11
Small UI motion only: menus, dish sheet, grid changes, page header tint
Three.js
^0.169
3D glass and liquid
@react-three/fiber
^8.17
Three.js inside React
@react-three/drei
^9.114
`Float`, `RoundedBox`, `ContactShadows`
ffmpeg (local tool)
any
Turn the hero video into WebP frames, compress videos
Higgsfield (via Claude)
n/a
AI dish photos (GPT Image 2.6) and the hero coffee video (Seedance 2.5)
Vercel
n/a
Hosting and deploys from GitHub
Git + GitHub
n/a
Version control
Not used, on purpose: Blender (no 3D modelling needed; the glass is built in code), Spline, a CMS, a database, a cart or payment system (ordering goes to Swiggy and Zomato). Ask before adding anything else.
Where each kind of visual comes from

Café interior, lounge, coffee bar, oven photos: real stills taken from the café's own Instagram reels.

Field Notes dishes (5): crops of the café's real poster photos.

Every other menu dish (about 83): generated in Higgsfield with GPT Image 2.6, one shared style prompt (section 5).

Hero video: generated in Higgsfield with Seedance 2.5, then turned into frames with ffmpeg. Until then, the café's strawberry-matcha pour clip is the placeholder.

3D glass in the signature section: drawn in code with Three.js, no image needed.

Intro film: the coffee-pour logo animation already made (`logo-pour.mp4`).

## 4. Project setup and folder structure
Create the app with the App Router, TypeScript, Tailwind and a `src/` folder, then add the motion and 3D packages.

Folder structure

```
betwen-us/
├── public/
│   ├── brand/        monogram.png (wordmark.png still to come)
│   ├── video/        logo-pour.mp4 (intro film, still to come)
│   ├── gallery/      café stills (.webp)
│   ├── dishes/       real poster crops (.webp)
│   ├── hero/frames/  0001.webp … from `npm run frames`
│   └── menu/         <slug>.webp, one per dish, from Higgsfield
├── scripts/
│   ├── extract-frames.sh           video → hero frames
│   └── make-higgsfield-prompts.mjs menu.json → one prompt per dish
├── src/
│   ├── app/          layout.tsx, globals.css, icon.png, page.tsx, menu/page.tsx
│   ├── components/   SmoothScroll, Loader, Nav, Monogram, OrderButtons, Hero, Intro,
│   │                 SignaturePours + GlassScene, FieldNotes, TheRoom, Lounge, Visit,
│   │                 Footer, menu/ (MenuBrowser, DishImage, DishSheet)
│   ├── data/menu.json
│   └── lib/          site.ts, menu.ts, drinks.ts, gsap.ts
├── tailwind.config.ts
└── next.config.mjs
```

Scripts in package.json: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `frames` (`bash scripts/extract-frames.sh`), `prompts` (`node scripts/make-higgsfield-prompts.mjs`).

## 5. Assets and Higgsfield generation
Real photos come from the café's own material; Higgsfield fills only the gaps (dish photos and the hero video). Generate in Higgsfield through Claude (claude.ai with the Higgsfield connector) or on higgsfield.ai, then save files into `public/` with the exact names below. Check credits first: images cost 0.25 credits each, a 5-second 720p hero video 35 credits, an 8-second full-quality one 56 credits.
Real assets already prepared (keep these names)
Folder
Files
Source
public/brand
monogram.png, wordmark.png
Cut from the logo image
public/video
logo-pour.mp4
Coffee-pour logo film made for the intro
public/gallery
dining-hall, planter-booths, staircase, teal-corner, arched-window, main-floor, coffee-bar, espresso-machine, garden-terrace, pendant-wall, balcony, wood-fire-oven, arches-night, lounge (.webp)
Stills from the café's interior reels
public/dishes
bharwan-paneer-tikka, kung-pao-rice-bowl, achari-caesar-salad, spinach-green-chilli-pasta, summer-mango-desserts (.webp)
Crops of the café's Instagram posters
public/hero/frames
0001–0092.webp
Placeholder: strawberry-matcha pour clip
To re-extract stills from a reel: `ffmpeg -ss <seconds> -i reel.mov -frames:v 1 -vf scale=900:-2 -c:v libwebp -quality 80 out.webp`.
Dish photos (Higgsfield, model GPT Image 2.6, 1:1)

Run `npm run prompts`. It writes `scripts/higgsfield-prompts.json` with one prompt per dish that has no real photo (about 83), each with its `slug` and target `file`.

Generate each prompt in Higgsfield with model `gpt_image_2_6`, aspect ratio 1:1, in batches of up to 12.

Download each result and save it as `public/menu/<slug>.webp` (convert PNG to WebP, max 1000 px wide, quality ~80).

Dishes without a file automatically show a branded placeholder tile, so missing images never break the page.
The shared style that every dish prompt ends with:

Editorial food photograph for Betwēn Us café, Hyderabad. Shot from a 45 degree angle on handmade sand-coloured stoneware, warm white linen surface, soft window daylight from the left, shallow depth of field, natural colours, a small edible flower garnish, no text, no logos, no hands, square 1:1 composition.
Each prompt starts with the dish name and its menu description, plus a vessel: coffee "in a ceramic cup or a clear takeaway tumbler as suits the drink", kitchen "plated in a wide stoneware bowl or plate", desserts "on a small dark slate or stoneware plate". Eight are already generated (Betwēn Us Latte, Biscoff Latte, Orange Cold Brew, Midnight Mocha, Hakka Noodles, Alfredo Pasta, Basque Cheesecake, Tiramisu): save them from Higgsfield into `public/menu/` first.
Hero video (Higgsfield, model Seedance 2.5, 16:9, 5–8 s)
Prompt:

Cinematic macro shot, slow motion. A stream of rich espresso pours from above into a sand-coloured handmade ceramic cup on a warm white surface; crema swirls and rises; the camera slowly pulls back and up to reveal the full cup on a café table with soft morning window light, a hint of maroon wall and green plants blurred behind. Warm natural colours, shallow depth of field, no text, no people, no logos, steady locked-off camera movement suitable for frame-by-frame scrubbing.
Then:

Save it as `hero.mp4` outside `public/`.

Run `npm run frames -- hero.mp4 30 1600`. It writes WebP frames to `public/hero/frames/` and prints the count.

Set `hero.frameCount` in `src/lib/site.ts` to that count. Keep total frames at or under 150 (about 3–5 MB) for phones; if bigger, use fps 20 or width 1280.
Optional later: a 9:16 version of the same video for phones, and Higgsfield images of the six signature drinks for the signature section's text side.

## 6. Home page, section by section
The home page runs in this order: intro film, header, hero, about line, signature pours, field notes, the room, private lounge, visit, footer. Copy below is final unless marked TODO.

### 6.1 Intro film (Loader)

Full-screen #5D1E17 overlay, z-index 100, plays `logo-pour.mp4` muted, inline, at 1.25× speed, centred, height min(70vh, 70vw).

Bottom row: left "Brewing 42%" (real progress of hero frame loading), right a "Skip intro" text button.

Leaves when the film has ended AND all hero frames are loaded, or after 9 seconds max. Exit: GSAP `clipPath` from `inset(0 0 0 0)` to `inset(0 0 100% 0)`, 1.1 s, `expo.inOut` (the curtain lifts).

Shows once per browser session (`sessionStorage`); repeat visits wait 350 ms only. Reduced-motion users get 700 ms and no film. Lenis is stopped while it shows.

### 6.2 Header (Nav)

Fixed, 72px tall, transparent at the top; after 24px of scroll it becomes porcelain at 85% with blur and a hairline maroon shadow.

Left: monogram + wordmark (wordmark hidden under 420px). Centre/right links (desktop ≥ 860px): Menu, The room, Private lounge, Visit.

"Order online" maroon pill opens a small popover: "Order on Swiggy", "Order on Zomato" (new tab). Closes on outside click and Escape.

Mobile: a two-line burger opens a full-width panel with the same links at 24px extralight, each 44px+ tall.

### 6.3 Hero: "Betwēn [arch] us"
The name is split by an arched window of coffee footage, so the coffee literally sits between "Betwēn" and "us".

Section 100svh, porcelain. Centre: the arch, width clamp(150px, 22vw, 340px), height clamp(230px, 58svh, 560px), radius 999px 999px 28px 28px, background #3D100C.

Inside the arch: a canvas sized to the full viewport (centred) so the arch reveals part of it; frames drawn "cover" with vertical focus 0.35.

Left of the arch "Betwēn", right "us": Outfit 200, maroon, clamp(40px, 13vw, 220px), 0.04em tracking. On phones under 640px, stack them: "Betwēn" above the arch, "us" below.

Bottom centre: "Scroll to pour" in 14px ink at 60%.

ScrollTrigger: pin the section, `end: "+=260%"`, `scrub: 0.6`. On one timeline: frames 0 → last over the full length (round to whole frames, redraw only on change); words slide out (xPercent ∓120, fade) from 5% to 50%; the arch grows to 100vw × 100svh and radius 0 from 12% to 62% (`power2.inOut`); a bottom gradient shade fades in at 55%; the tagline rises in at 62%, two lines staggered: "For pauses" (Outfit 200) and "and conversations in betwēn." (Instrument Serif italic), both clamp(34px, 6vw, 84px), porcelain.

Preload all frames on mount and report progress to the loader with a `hero-progress` window event.

### 6.4 About line (Intro)

Two columns on desktop: clay monogram (120px) left; right a large extralight maroon statement, clamp(30px, 4.2vw, 58px), max 24ch: "A café in Kondapur for slow coffee, food from the wok and the wood fire, and the conversations that happen in betwēn."

Under it, 18px ink at 75%: "Café, Continental, Indo-Chinese and desserts, under one maroon ceiling. Come for a quick espresso or stay the whole evening."

### 6.5 Signature pours (the memorable moment)

Full-screen section whose background and text colour change with each of the six drinks in section 2, in that order.

Desktop: two columns, text left, 3D glass right (78svh tall). Phone: glass on top (42svh), text below.

Text: "Signature pours" small label, drink name (Outfit 200, clamp(44px, 7vw, 104px)), menu description in Instrument Serif italic. On change, the old text fades up and out and the new fades up in (Framer Motion `AnimatePresence`, 0.45 s).

Below: "See all coffee" outline pill (links to /menu?group=coffee) and six progress dots; the active dot stretches to 32px.

ScrollTrigger: pin, length 70% of viewport per drink, `scrub: true`, snap to each drink. When the active drink changes, GSAP tweens the section `backgroundColor` and `color` to that drink's values over 0.7 s.

3D glass (React Three Fiber, loaded with `next/dynamic`, no SSR): a tapered tumbler from `LatheGeometry` (height 2.4, top radius 0.86, bottom 0.7), physical material white, opacity 0.22, clearcoat 1. Inside, three cylinder layers whose colours and heights ease toward the active drink every frame. Three rounded ice cubes scale in for iced drinks and out for hot ones. The glass floats gently (drei `Float`), tilts toward the pointer, and has a soft contact shadow. Camera fov 32 at (0, 0.4, 6); dpr capped at 1.75.

### 6.6 Field notes

Uses the café's own "Field Notes" format. Desktop ≥ 900px: pinned horizontal scroll (track moves left by its overflow width, `scrub: 0.8`). Phones: stacked cards.

Intro column: "Field notes" title, line "What our kitchen is proud of this season, and what tends to happen at the table once it arrives." and a "Browse the full menu" pill.

Five cards (radius 28px, own soft background, maroon text, "Betwēn Us, Field Notes" top-left and "No. 11" top-right only where the café gave a number):

Bharwan Paneer Tikka, No. 11, bg #F6E8D6; Observed effects: Table-wide attention, Reduced conversation, Rapid plate depletion.

Kung Pao Rice Bowl, No. 19, bg #F3E3D0; Observed effects: Increased fork activity, Heightened anticipation, Accelerated consumption.

Achari Caesar Salad, bg #EFE6D4.

Spinach & Green Chilli Pasta, bg #E6EBD9.

Summer Madness (Mangomisu, mango mousse, mango tart), bg #F7E7C8. TODO: confirm still on the menu.

"Observed effects" sits in a porcelain note on the photo, in Instrument Serif italic.

### 6.7 The room

Title "The room" and line "Maroon ceilings, a checkered floor, rattan lights and more plants than we can count. Pick a booth, the balcony or the garden terrace."

Two endless photo strips of real café stills, rounded 22px, 260px tall on phones and 380px on desktop. Row one scrolls left (70 s loop), row two right (80 s). Pauses on hover or focus. Each photo has descriptive alt text.

### 6.8 Private lounge

#3D100C background, porcelain text. Lounge photo in the arch shape on the left; right: "The private lounge" and "A separate room with deep sofas and its own screen, for birthdays, team evenings and small celebrations. Tell us the date and the headcount and we will plan the food and drinks with you."

Buttons: "Call +91 80963 34448" (tel link) and "Message us on Instagram".

### 6.9 Visit

Title "Come over", then a definition list: Where (Kondapur, Hyderabad + "Get directions" Google Maps link), When (TODO hours), Call, Follow (@betwenus.hyd).

"Rather eat at home?" with Swiggy and Zomato buttons.

Right: the night arches photo linking to Google Maps with an "Open in Google Maps" pill.

### 6.10 Footer

Maroon background: clay monogram, porcelain wordmark, the tagline in serif italic; links Menu, Private lounge, Visit, Instagram; "© 2026 Betwēn Us, Kondapur, Hyderabad".

## 7. Menu page (/menu)
The menu page lists all 90 items with section tabs, category chips, search, 12 dishes per page and a detail sheet with ordering. All filter state lives in the URL so links can be shared and the back button works.
Header

Coloured band (tint per section from section 2, animated over 0.6 s when the section changes), giant faint monogram watermark on the right at 8% opacity.

"Menu" in Outfit 200, clamp(52px, 9vw, 140px); line "90 things to eat and drink. Tap any dish for details and to order."
Sticky filter bar (sticks under the header, porcelain at 90% with blur)

Section tabs (role tablist): Everything, Coffee, Kitchen, Desserts. Active = maroon pill.

Search box: placeholder "Search, e.g. cold brew", debounced 250 ms, accent-insensitive ("betwen" finds "Betwēn"), matches name, description and category.

Category chips under it, horizontally scrollable on phones: "All <section>" then each category in that section.

URL params: `group`, `cat`, `q`, `page`. Changing group resets cat and page.
Grid

1 column on phones, 2 from 640px, 3 from 1024px; 12 per page.

Card: 4:3 photo (radius 22px, zooms to 1.04 on hover), category in small grey, name in 24px maroon light, description clamped to 2 lines. The whole card is one button.

Cards fade up in with a 30 ms stagger when the list changes (Framer Motion `layout` + `AnimatePresence mode="popLayout"`).

Count line above: "Showing 13–24 of 90" (announced politely to screen readers).

Empty state: "Nothing called “xyz” yet." + "Show the whole menu" button that clears everything.
Pagination: Previous, numbered 44px circles (current = maroon), Next. Changing page scrolls smoothly back to the top of the grid.
Dish images: `DishImage` loads `item.img` if set (real poster crops), otherwise `/menu/<slug>.webp`. If that file is missing (`onError`), show a tinted tile with a faint monogram and "Photo coming soon". Use `next/image` with proper `sizes`.
Dish sheet

Opens on tap: a bottom sheet on phones (rounded top, max 92svh, scrolls inside) and a centred 880px dialog on desktop, photo left and text right.

Shows category, name, description, the category note (for example "Choice of rice with signature Asian sauces"), protein options as chips when the item or category has them, and Swiggy / Zomato buttons.

`role="dialog"`, `aria-modal`, focus moves to the close button, Escape and backdrop tap close it, focus returns to the card, Lenis stops while open.
Ordering: every Order button opens the café's Swiggy or Zomato page in a new tab (links from `site.ts`, TODO). No cart, no prices (the café asked to leave prices out for now).

## 8. Content and data
All menu text lives in one JSON file and all café facts in one config file, so the owner can change them without touching components. Use only the facts below; anything missing stays a TODO.
Confirmed café facts (from the café's own posts)
Fact
Value
Name
Betwēn Us
Tagline
For pauses and conversations in betwēn.
Area
Kondapur, Hyderabad
Cuisines
Café, Continental, Indo-Chinese and desserts
Phone
+91 80963 34448 (tel:+918096334448)
Instagram
@betwenus.hyd (https://www.instagram.com/betwenus.hyd/)
Opened
28 February 2026
Spaces
Main dining floor, planter booths, balcony, garden terrace, coffee bar, private lounge with a screen, wood-fire oven
`src/lib/site.ts` holds: name, tagline, area, phone + phoneHref, instagram + instagramHref, mapsHref (Google Maps search for "Betwen Us Cafe Kondapur Hyderabad"), hours (TODO), cuisines, `order.swiggy` and `order.zomato` (TODO), and `hero` = { frameCount, framePath "/hero/frames/", frameExt "webp", focusY 0.35 }.
`src/data/menu.json` schema

`group` is `coffee`, `kitchen` or `desserts`. `slug` = lowercase name, ē → e, & → and, other characters → hyphens.
Categories and item counts (90 items, copied word for word from the café's printed menu)
Group
Category
Items
Coffee
Classic coffee, hot
8: Espresso, Americano, Cappuccino, Latte, Flat White, Mocha, Cortado, Macchiato
Coffee
Classic coffee, cold
8: Iced Americano, Iced Latte, Iced Mocha, Cold Coffee, Orange Espresso, Cranberry Coffee, Coconut Coffee, Tonic Espresso
Coffee
Cold brew collection
8: Classic, Vanilla Cream, Salted Caramel, Cranberry, Tonic, Orange, Coconut, Velvet Cold Brew
Coffee
Frappes
7: Classic Coffee, Mocha, Caramel, Hazelnut, Oreo, Dark Chocolate, KitKat
Coffee
Signature specialty drinks
10: Biscoff Latte, Betwēn Us Latte, Spanish Latte, Vietnamese Iced Coffee, Orange Latte, Midnight Mocha, Affogato 2.0, Hazelnut, Caramel and Mocha Affogato
Coffee
Manual brew selection
3: Pour Over (V60), French Press, AeroPress
Kitchen
House specials
3: Bharwan Paneer Tikka, Kung Pao Rice Bowl, Achari Caesar Salad
Kitchen
Asian rice bowls
4: Asian Green Fried Rice, Szechwan, Singapore, Burnt Garlic Rice
Kitchen
Noodles
5: Hakka, Szechwan, Mongolian, Dragon, Thai Chili Garlic
Kitchen
Comfort bowls
2: Stroganoff (Mushroom, Chicken), Betwēn Us Bowl (Chicken, Paneer)
Kitchen
Fried rice specials
4: Burnt Garlic Fried Rice, Shanghai, Kung Pao, Ginger Capsicum Rice
Kitchen
Asian gravy bowls
4: Chili Sauce, Manchurian, Kung Pao, Schezwan Gravy
Kitchen
Signature pasta
4: Aglio e Olio, Alfredo, Pink Sauce, Spinach Green Chili (Mushroom, Chicken, Prawns)
Kitchen
Sandwiches
4: Paneer Tikka Romesco, Ceylon Grilled Chicken, Caprese, Creamy Utah Mushrooms
Desserts
Desserts
13: Walnut Brownie, Biscoff Cheesecake, Basque Cheesecake, Hazelnut Cake, Tiramisu, Coffee Mousse, Biscoff Cookie, Macarons, Vanilla Muffin, Hazelnut Crumble, Chocolate Tart, Mango Panna Cotta, Celebration Cakes
Desserts
Summer madness
3: Mangomisu, Mango Mousse, Mango Tart
The full descriptions are already in `menu.json` in the zip. If building from scratch, ask me for the menu photos and transcribe them exactly. Two edits to confirm with the café: "Ceylon Grilled Chicken" says "chicken mutton breast" on the printed menu (changed to "chicken breast"); the three mango desserts have no descriptions yet.
`src/lib/drinks.ts` holds the six signature drinks with name, menu description, bg, fg, three liquid layers and an `ice` flag, exactly as in section 2.

## 9. Motion, performance, accessibility, responsive
Motion is concentrated in three scroll scenes (hero, signature pours, field notes) and stays quiet everywhere else. Every effect must have a calm fallback.
Motion rules

Lenis smooth scroll (`lerp: 0.1`), driven by the GSAP ticker; `lenis.on("scroll", ScrollTrigger.update)`; `gsap.ticker.lagSmoothing(0)`.

Register ScrollTrigger and `useGSAP` once in `src/lib/gsap.ts`. Build every scene inside `useGSAP` with a `scope` so it cleans up on unmount; use `gsap.matchMedia()` for desktop-only scenes.

`ScrollTrigger.config({ ignoreMobileResize: true })` so the phone address bar does not re-trigger layouts.

Easing: `expo.inOut` for the loader curtain, `power2.inOut` for the arch, `power2.out` for colour changes, `none` for scrubbed timelines. UI motion with Framer Motion: 0.18–0.45 s, ease [0.22, 1, 0.36, 1].

No fade-up on every section; only the three scenes plus small responses to taps (menus, sheet, grid).
Reduced motion (`prefers-reduced-motion: reduce`): no Lenis, no pinning, no marquee; hero shows the arch full screen with the tagline; signature section shows the first drink; the loader skips the film.
Performance budgets

Hero frames ≤ 150 WebP files, ≤ 5 MB total; preload them, draw on a canvas, redraw only when the frame index changes; canvas DPR capped at 2.

3D: load `GlassScene` with `next/dynamic` and `ssr: false`; DPR [1, 1.75]; no environment maps or HDR downloads.

All photos through `next/image` with `sizes`; dish images ≤ 1000 px WebP.

Fonts via `next/font` with `display: swap`.

Targets on mobile Lighthouse: Performance 85+, Accessibility 95+, Best Practices 95+, SEO 95+. LCP under 2.5 s on 4G.
Accessibility

Every interactive element is a real `<button>` or `<a>`, at least 44 × 44 px, with a visible focus ring (2px maroon outline, 3px offset).

Contrast at least 4.5:1 for text; check every drink background against its text colour.

One `<h1>` per page (hero has a visually hidden h1 with the café name and tagline).

Photos have descriptive alt text; decorative images use empty alt; the canvas and 3D are `aria-hidden`.

Marquee rows pause on hover and keyboard focus. Dialogs trap focus and close with Escape.
Responsive breakpoints
Width
Changes
< 420px
Header shows monogram only
< 640px
Hero words stack above and below the arch; menu grid 1 column
640px+
Menu grid 2 columns; search box 290px
860px+
Desktop nav links shown, burger hidden
900px+
Signature section two columns; field notes scroll horizontally
1024px+
Menu grid 3 columns
1280px
Max content width (page padding 20px phones, 32px desktop)
Use `svh` units for full-screen sections so phone address bars don't cause jumps; add `viewport-fit=cover` and safe-area padding for notched phones.

## 10. Build phases and testing
Build in seven phases; after each, Claude Code runs `npm run build`, fixes every error, and shows me the result before moving on.

Foundation: project setup, Tailwind tokens, fonts, `globals.css`, brand masks, `site.ts`, Nav, Footer, Lenis + GSAP wiring.

Intro and hero: Loader, frame preloading, the "Betwēn [arch] us" scroll scene, mobile stacking.

Signature pours: drinks data, React Three Fiber glass, colour changes, snapping, reduced-motion fallback.

Content sections: About line, Field notes (horizontal on desktop), The room strips, Lounge, Visit.

Menu page: data, URL state, filters, search, pagination, dish images with placeholders, dish sheet.

Real visuals: save Higgsfield dish photos to `public/menu/`, generate the hero video, run `npm run frames`, update `frameCount`.

Polish and testing: everything below, then fix what it finds.
Technical checks

`npm run typecheck` and `npm run build` pass with no errors or warnings.

Lighthouse on mobile meets the targets in section 9.

Test on a real Android phone (Chrome) and iPhone (Safari), plus desktop Chrome, Safari and Firefox, at 375px, 768px, 1280px and 1920px wide.

Scroll the whole home page fast and slow: no jumps, no blank frames, pinned sections release cleanly, the header never covers headings.

Menu: every tab, chip, search, page and dish sheet works; the URL updates; back button restores state; missing images show placeholders.

Keyboard only: every link and button reachable, focus visible, sheet closes with Escape. Turn on reduced motion and repeat.

Every Order, Call, Instagram and Maps link opens the right place.
Visitor reviews by age group. After the build works, review the site as each of these visitors on a phone, write what they would feel, what pleases them and what frustrates them, then fix the frustrations and review again.
Visitor
What they want
What to check
Child, about 8–12
Fun, colour, something that moves
Does the colour-changing glass delight them? Is anything scary, slow or confusing? Are the dessert photos tempting?
Student, about 18–25
A good-looking place to hang out, quick decisions
Does it feel worth sharing on Instagram? How fast can they see coffee options and order on Swiggy or Zomato?
Working adult, about 26–45
Plan a meeting or a birthday
Can they find the lounge, call, and get directions in two taps? Does the menu load fast on mobile data?
Parent with family, about 35–55
Something for everyone
Is it easy to find kids' and veg-friendly items through search? Are text and buttons clear?
Older visitor, 60+
Read the menu and find the café
Is text large and high contrast? Can they skip the intro? Is scrolling too fast or the motion too much? Is the phone number obvious?
Write these reviews in a `REVIEW.md` file with a short list of fixes for each group, apply the fixes, and note what changed.

## 11. Deployment and open items
Deploy from GitHub to Vercel; the site needs no environment variables or database.

`git init`, commit, push to a new GitHub repository.

On vercel.com: Add New → Project → import the repository → Deploy (framework auto-detected as Next.js).

Every push to `main` redeploys. Add the café's domain later under Project → Settings → Domains.

After the first deploy, run Lighthouse on the live URL and check the Open Graph preview (title "Betwēn Us", tagline, main-floor photo) when sharing the link on WhatsApp.
Open items to confirm with the café (keep as TODO placeholders until answered)

Swiggy listing link

Zomato listing link

Opening hours (an old listing says 11 AM to 11 PM; unconfirmed)

Full street address for the Visit section and Maps link

Is the Summer Madness mango menu still running?

Is wood-fire pizza on the menu? (seen in their reels, not on the printed menu)

"Ceylon Grilled Chicken" description: chicken breast, not "chicken mutton breast"?

Descriptions for Mangomisu, Mango Mousse and Mango Tart

Lounge capacity, if they want it shown

Prices: left out for now by request; add a `price` field later if they change their mind

Higgsfield credits for the remaining ~75 dish photos (~19 credits) and the hero video (35–56 credits per attempt)
