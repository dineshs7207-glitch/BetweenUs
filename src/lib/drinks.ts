export type Layer = { color: string; height: number };

export type Drink = {
  slug: string;
  name: string;
  description: string;
  bg: string;
  fg: string;
  /** Soft page tint behind the drink in "Choose your drink", and the colour of its giant name */
  tint: string;
  ink: string;
  /** Liquid layers, bottom to top. Heights are fractions of the glass. */
  layers: [Layer, Layer, Layer];
  ice: boolean;
};

const NONE: Layer = { color: "#FFFFFF", height: 0 };

export const drinks: Drink[] = [
  {
    slug: "orange-cold-brew",
    name: "Orange Cold Brew",
    description: "Citrusy cold brew infused with refreshing orange and bold coffee notes.",
    bg: "#F27A1D",
    tint: "#FBE0C6",
    ink: "#B4500F",
    fg: "#2E1004",
    layers: [
      { color: "#FFA43A", height: 0.42 },
      { color: "#4A2512", height: 0.36 },
      NONE,
    ],
    ice: true,
  },
  {
    slug: "cranberry-cold-brew",
    name: "Cranberry Cold Brew",
    description: "Cold brew with added cranberry juice.",
    bg: "#A8102F",
    tint: "#F7D7DC",
    ink: "#8E1230",
    fg: "#FFF1EE",
    layers: [
      { color: "#D21E45", height: 0.48 },
      { color: "#3B1B10", height: 0.32 },
      NONE,
    ],
    ice: true,
  },
  {
    slug: "midnight-mocha",
    name: "Midnight Mocha",
    description: "Dark cocoa layered with double espresso intensity.",
    bg: "#3C1F5E",
    tint: "#E7DEEE",
    ink: "#3C1F5E",
    fg: "#F3EAFE",
    layers: [
      { color: "#24120C", height: 0.5 },
      { color: "#4A2618", height: 0.24 },
      { color: "#D8C3AE", height: 0.08 },
    ],
    ice: false,
  },
  {
    slug: "coconut-cold-brew",
    name: "Coconut Cold Brew",
    description:
      "Smooth cold brew blended with creamy coconut for a refreshing tropical coffee experience.",
    bg: "#1F6E6A",
    tint: "#DCEDE7",
    ink: "#1F6E6A",
    fg: "#EFFFFC",
    layers: [
      { color: "#F4EFE6", height: 0.4 },
      { color: "#5B3420", height: 0.4 },
      NONE,
    ],
    ice: true,
  },
  {
    slug: "biscoff-latte",
    name: "Biscoff Latte",
    description:
      "Espresso blended with creamy milk and rich Biscoff flavour for a smooth caramelised finish.",
    bg: "#B5652A",
    tint: "#F5E0C8",
    ink: "#94501E",
    fg: "#FFF6EC",
    layers: [
      { color: "#E6CBA8", height: 0.52 },
      { color: "#7A4424", height: 0.2 },
      { color: "#F3E3CF", height: 0.08 },
    ],
    ice: false,
  },
  {
    slug: "betwen-us-latte",
    name: "Betwēn Us Latte",
    description:
      "Caramelized white chocolate blended with espresso and crowned with sea salt foam.",
    bg: "#5A1A14",
    tint: "#F1E2D8",
    ink: "#5A1A14",
    fg: "#F6EEE3",
    layers: [
      { color: "#EAD9C2", height: 0.5 },
      { color: "#8A5532", height: 0.16 },
      { color: "#FFFFFF", height: 0.12 },
    ],
    ice: false,
  },
];
