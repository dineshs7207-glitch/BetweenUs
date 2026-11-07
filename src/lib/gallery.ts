/** Real café stills (from the café's interior reels). Files live in /public/gallery. */
export type Photo = { file: string; alt: string; label: string };

export const roomRowOne: Photo[] = [
  { file: "dining-hall.webp", label: "Dining hall", alt: "The main dining hall under the maroon ceiling, with rattan pendant lights" },
  { file: "planter-booths.webp", label: "Planter booths", alt: "Booth seating separated by tall planters full of green plants" },
  { file: "staircase.webp", label: "Staircase", alt: "The staircase leading up to the first floor" },
  { file: "teal-corner.webp", label: "Teal corner", alt: "A corner table with teal chairs by the window" },
  { file: "arched-window.webp", label: "Arched window", alt: "An arched window letting daylight onto a table for two" },
  { file: "main-floor.webp", label: "Main floor", alt: "The main floor with its checkered tiles and wooden tables" },
  { file: "coffee-bar.webp", label: "Coffee bar", alt: "The coffee bar counter with cups lined up" },
];

export const roomRowTwo: Photo[] = [
  { file: "espresso-machine.webp", label: "Espresso machine", alt: "The espresso machine mid-pour at the coffee bar" },
  { file: "garden-terrace.webp", label: "Garden terrace", alt: "Outdoor tables on the garden terrace among plants" },
  { file: "pendant-wall.webp", label: "Pendant wall", alt: "A wall of woven rattan pendant lights" },
  { file: "balcony.webp", label: "Balcony", alt: "Seats on the balcony overlooking the street" },
  { file: "wood-fire-oven.webp", label: "Wood-fire oven", alt: "The wood-fire oven glowing in the kitchen" },
  { file: "arches-night.webp", label: "Arches at night", alt: "The café's arches lit up at night" },
];

export const loungePhoto: Photo = {
  file: "lounge.webp",
  label: "Private lounge",
  alt: "The private lounge with deep sofas and a screen on the wall",
};

export const visitPhoto: Photo = {
  file: "arches-night.webp",
  label: "Arches at night",
  alt: "The café's arched front lit up at night, Kondapur",
};
