/**
 * Every café fact lives here so the owner can change them without touching
 * components. Anything marked TODO is waiting for the café to confirm.
 */
export const site = {
  name: "Betwēn Us",
  tagline: "For pauses and conversations in betwēn.",
  area: "Kondapur, Hyderabad",
  /** TODO: full street address from the café */
  address: null as string | null,
  cuisines: "Café, Continental, Indo-Chinese and desserts",
  opened: "28 February 2026",
  phone: "+91 80963 34448",
  phoneHref: "tel:+918096334448",
  instagram: "@betwenus.hyd",
  instagramHref: "https://www.instagram.com/betwenus.hyd/",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Betwen%20Us%20Cafe%20Kondapur%20Hyderabad",
  /** TODO: opening hours (an old listing says 11 AM to 11 PM, unconfirmed) */
  hours: null as string | null,
  order: {
    /** TODO: Swiggy listing link */
    swiggy: "https://www.swiggy.com/search?query=Betwen%20Us%20Kondapur",
    /** TODO: Zomato listing link */
    zomato: "https://www.zomato.com/hyderabad/restaurants?q=Betwen%20Us%20Kondapur",
  },
  hero: {
    /**
     * Number of WebP frames in /public/hero/frames (0001.webp …).
     * 0 = no frames yet: the hero draws a coded coffee pour instead.
     * After `npm run frames -- hero.mp4 30 1600`, set this to the printed count.
     */
    frameCount: 0,
    framePath: "/hero/frames/",
    frameExt: "webp",
    focusY: 0.35,
  },
  intro: {
    /** Set to "/video/logo-pour.mp4" once the logo film is in public/video. */
    video: null as string | null,
  },
} as const;

export type Site = typeof site;
