# Visitor review (first pass)

Reviewed on a 375–390px phone viewport, 1280–1440px desktop, dark mode and reduced motion, with
Playwright screenshots at every section. Real-device testing (Android Chrome, iPhone Safari) and
Lighthouse on the live URL are still to do after the first Vercel deploy.

## Child, 8–12
- Pleased by: the glass changing colour and filling with each drink; the coffee pouring into the cup as you scroll.
- Frustrated by: most dessert tiles say "Photo coming soon".
- Fixes: none in code; dessert photos are first in the Higgsfield queue.

## Student, 18–25
- Pleased by: the Ube collection and the signature drinks look shareable; "Order online" is always in the header.
- Frustrated by: Swiggy/Zomato buttons open a search, not the café's listing.
- Fixes: links are single values in `site.ts`; swap in the real listings when the café sends them.

## Working adult, 26–45
- Pleased by: Private lounge and Visit are in the header; call button is a real `tel:` link; menu is static and light.
- Frustrated by: the header was hard to read over the coloured menu band.
- Fixed: the header is solid porcelain on every page except the home hero.

## Parent with family, 35–55
- Pleased by: search is accent-insensitive and matches descriptions ("paneer", "mango", "chicken").
- Frustrated by: no way to spot vegetarian desserts.
- Fixed: added the veg / non-veg marks from the printed dessert menu to cards and the dish sheet.

## Older visitor, 60+
- Pleased by: 18px body text, large phone number in Visit, "Skip intro" on the loader, intro shows once per session.
- Frustrated by: moving photo strips; with reduced motion the header was low-contrast over the dark hero.
- Fixed: "Pause photos" button on The room strips (plus pause on hover/focus); header is solid when reduced motion is on.
