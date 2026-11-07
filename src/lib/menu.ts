import data from "@/data/menu.json";

export type Group = "coffee" | "kitchen" | "desserts";
export type GroupFilter = Group | "all";

export type Category = {
  id: string;
  group: Group;
  name: string;
  note?: string;
  proteins?: string[];
};

export type MenuItem = {
  slug: string;
  name: string;
  description: string;
  group: Group;
  category: string;
  proteins?: string[];
  diet?: "veg" | "nonveg";
  img?: string;
};

export const categories = data.categories as Category[];
export const items = data.items as MenuItem[];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<
  string,
  Category
>;

export const groups: { id: GroupFilter; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "coffee", label: "Coffee" },
  { id: "kitchen", label: "Kitchen" },
  { id: "desserts", label: "Desserts" },
];

export const groupTint: Record<GroupFilter, { bg: string; fg: string; tile: string }> = {
  all: { bg: "#5A1A14", fg: "#F6EEE3", tile: "#F6EEE3" },
  coffee: { bg: "#8A4B26", fg: "#FFF4E8", tile: "#F3E6D8" },
  kitchen: { bg: "#2F5D3A", fg: "#F1F7EC", tile: "#E7EEDF" },
  desserts: { bg: "#9C2F45", fg: "#FFF0F2", tile: "#F7E3E0" },
};

export const PAGE_SIZE = 12;

/** Lowercase and strip accents so "betwen" finds "Betwēn". */
export const fold = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/ē/g, "e")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function filterItems(group: GroupFilter, cat: string | null, q: string) {
  const needle = fold(q.trim());
  return items.filter((it) => {
    if (group !== "all" && it.group !== group) return false;
    if (cat && it.category !== cat) return false;
    if (!needle) return true;
    const c = categoryById[it.category];
    return fold(`${it.name} ${it.description} ${c?.name ?? ""} ${c?.note ?? ""}`).includes(
      needle,
    );
  });
}

export const proteinsFor = (it: MenuItem) => it.proteins ?? categoryById[it.category]?.proteins;
