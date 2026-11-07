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
     * Cinematic hero film (Higgsfield: GPT Image 2.6 keyframes + Kling 3.0),
     * scrubbed by scroll. Takes priority over frames and the coded pour.
     * Set to null to fall back to frames / the coded pour.
     */
    video: {
      desktop: "https://d2ol7oe51mr4n9.cloudfront.net/user_3LauN9Q9jzsnnIRwfKAjtqHSvEs/6ca8f78e-f133-45df-94a8-976b3c5fa104.mp4",
      mobile: "https://d2ol7oe51mr4n9.cloudfront.net/user_3LauN9Q9jzsnnIRwfKAjtqHSvEs/8deedcfd-04ed-4747-ac27-070b4abaf54c.mp4" as string | undefined,
      posterMobile: "https://d2ol7oe51mr4n9.cloudfront.net/user_3LauN9Q9jzsnnIRwfKAjtqHSvEs/bd5ee0a0-1a84-4f76-9df2-10bb442a2475.jpg" as string | undefined,
      poster: "https://d2ol7oe51mr4n9.cloudfront.net/user_3LauN9Q9jzsnnIRwfKAjtqHSvEs/53a7c94b-6de3-4b8f-b571-4fb016bd99b0.jpg",
      focusY: 0.5,
    } as null | {
      desktop: string;
      mobile?: string;
      poster: string;
      posterMobile?: string;
      focusY: number;
    },
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
