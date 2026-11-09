/** Real café stills (from the café's own reels). Files live in /public/gallery. */
export type Photo = { file: string; alt: string; label: string };

export const roomRowOne: Photo[] = [
  { file: "hall.webp", label: "Main hall", alt: "The main hall under the maroon ceiling, with rattan pendant lights and red banquettes" },
  { file: "dining.webp", label: "Arched dining room", alt: "The arched dining room with its cream and red checkered floor" },
  { file: "stairs.webp", label: "Staircase", alt: "The open staircase leading up to the first floor" },
  { file: "pendants.webp", label: "Glass pendants", alt: "Glass pendant lights hanging over the stairwell" },
  { file: "logo-wall.webp", label: "The Betwēn Us wall", alt: "The Betwēn Us logo on the café wall" },
  { file: "machine.webp", label: "Espresso bar", alt: "The espresso machine at the coffee bar" },
  { file: "cups.webp", label: "Our cups", alt: "Betwēn Us cups stacked at the counter" },
];

export const roomRowTwo: Photo[] = [
  { file: "terrace.webp", label: "Garden terrace", alt: "Outdoor tables on the leafy garden terrace" },
  { file: "courtyard.webp", label: "Courtyard", alt: "Courtyard seating among plants" },
  { file: "strawberry-matcha.webp", label: "Strawberry matcha", alt: "Matcha being poured over strawberry and milk in a clear cup" },
  { file: "matcha-whisk.webp", label: "Matcha, whisked", alt: "Matcha being whisked to order" },
  { file: "cold-drink.webp", label: "Something cold", alt: "A cold drink at the bar" },
  { file: "pizza.webp", label: "From the kitchen", alt: "A pizza being prepared in the kitchen" },
];

export const loungePhoto: Photo = {
  file: "lounge.webp",
  label: "Private lounge",
  alt: "The private lounge with deep sofas and a screen on the wall",
};

export const visitPhoto: Photo = {
  file: "terrace.webp",
  label: "Garden terrace",
  alt: "The Betwēn Us garden terrace, Kondapur",
};
