"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  PAGE_SIZE,
  categories,
  categoryById,
  filterItems,
  groupTint,
  groups,
  items,
  type GroupFilter,
  type MenuItem,
} from "@/lib/menu";
import { Monogram } from "../Monogram";
import { scrollToTarget } from "../SmoothScroll";
import DishImage from "./DishImage";
import DishSheet from "./DishSheet";
import DietMark from "./DietMark";

const ease = [0.22, 1, 0.36, 1] as const;
const isGroup = (g: string | null): g is GroupFilter =>
  g === "all" || g === "coffee" || g === "kitchen" || g === "desserts";

export default function MenuBrowser({ availableSlugs }: { availableSlugs: string[] }) {
  const available = useMemo(() => new Set(availableSlugs), [availableSlugs]);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const group: GroupFilter = isGroup(params.get("group")) ? (params.get("group") as GroupFilter) : "all";
  const catParam = params.get("cat");
  const cat = catParam && categoryById[catParam] && (group === "all" || categoryById[catParam].group === group) ? catParam : null;
  const q = params.get("q") ?? "";
  const pageParam = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);

  const [query, setQuery] = useState(q);
  const [open, setOpen] = useState<MenuItem | null>(null);
  const lastCard = useRef<HTMLElement | null>(null);
  const gridTop = useRef<HTMLDivElement>(null);

  // Keep the search box in sync with back/forward navigation
  useEffect(() => setQuery(q), [q]);

  const setParams = useCallback(
    (next: Record<string, string | null>, mode: "push" | "replace" = "push") => {
      const sp = new URLSearchParams(params.toString());
      Object.entries(next).forEach(([k, v]) => (v ? sp.set(k, v) : sp.delete(k)));
      if (sp.get("group") === "all") sp.delete("group");
      if (sp.get("page") === "1") sp.delete("page");
      const s = sp.toString();
      router[mode](s ? `${pathname}?${s}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  // Debounced search → URL
  useEffect(() => {
    if (query === q) return;
    const t = window.setTimeout(() => setParams({ q: query.trim() ? query : null, page: null }, "replace"), 250);
    return () => window.clearTimeout(t);
  }, [query, q, setParams]);

  const results = useMemo(() => filterItems(group, cat, q), [group, cat, q]);
  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(pageParam, pages);
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const chips = categories.filter((c) => group === "all" || c.group === group);
  const tint = groupTint[group];

  const goPage = (p: number) => {
    setParams({ page: String(p) });
    if (gridTop.current) scrollToTarget(gridTop.current, -170);
  };

  const closeSheet = useCallback(() => {
    setOpen(null);
    window.setTimeout(() => lastCard.current?.focus(), 0);
  }, []);

  const groupLabel = groups.find((g) => g.id === group)?.label ?? "Everything";

  return (
    <>
      {/* Header band, tinted per section */}
      <motion.header
        className="fixed-palette relative overflow-hidden pt-[72px]"
        initial={false}
        animate={{ backgroundColor: tint.bg, color: tint.fg }}
        transition={{ duration: 0.6, ease }}
      >
        <Monogram className="pointer-events-none absolute -right-[4vw] top-[50px] h-[130%] opacity-[0.08]" />
        <div className="relative mx-auto max-w-site px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-20">
          <h1 className="text-[clamp(52px,9vw,140px)] font-extralight leading-[0.95] tracking-[-0.02em]">Menu</h1>
          <p className="mt-5 max-w-[46ch] text-body opacity-85">
            {items.length} things to eat and drink. Tap any dish for details and to order.
          </p>
        </div>
      </motion.header>

      {/* Sticky filters */}
      <div className="sticky top-[calc(72px+env(safe-area-inset-top))] z-40 border-b border-maroon/10 bg-porcelain/90 backdrop-blur-md">
        <div className="mx-auto max-w-site px-5 py-3 md:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div role="tablist" aria-label="Menu sections" className="no-scrollbar -mx-1 flex overflow-x-auto px-1">
              {groups.map((g) => {
                const active = g.id === group;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    type="button"
                    aria-selected={active}
                    aria-controls="menu-grid"
                    onClick={() => !active && setParams({ group: g.id, cat: null, page: null })}
                    className={`mr-1 inline-flex min-h-[44px] shrink-0 items-center rounded-full px-5 text-[16px] transition-colors ${
                      active ? "bg-maroon text-on-maroon" : "text-ink/80 hover:bg-oat"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
            <label className="relative block sm:w-[290px]">
              <span className="sr-only">Search the menu</span>
              <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/50" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search, e.g. cold brew"
                className="h-[46px] w-full rounded-full border border-maroon/15 bg-porcelain pl-11 pr-4 text-[16px] text-ink placeholder:text-ink/50 focus:border-maroon/40 focus:outline-none focus-visible:outline-2 focus-visible:outline-maroon"
              />
            </label>
          </div>
          <div className="no-scrollbar -mx-5 mt-2 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" aria-label="Categories" role="group">
            <Chip active={!cat} onClick={() => setParams({ cat: null, page: null })}>
              All {group === "all" ? "dishes" : groupLabel.toLowerCase()}
            </Chip>
            {chips.map((c) => (
              <Chip key={c.id} active={cat === c.id} onClick={() => setParams({ cat: c.id, page: null })}>
                {c.name}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <section id="menu-grid" aria-label={`${groupLabel} menu`} className="mx-auto min-h-[70svh] max-w-site px-5 pb-24 pt-8 md:px-8">
        <div ref={gridTop} />
        <p className="mb-6 text-[15px] text-ink/60" aria-live="polite">
          {results.length > 0
            ? `Showing ${(page - 1) * PAGE_SIZE + 1}–${(page - 1) * PAGE_SIZE + shown.length} of ${results.length}`
            : "No dishes found"}
        </p>

        {results.length === 0 ? (
          <div className="rounded-[28px] bg-oat px-6 py-16 text-center">
            <p className="text-[clamp(24px,3vw,34px)] font-extralight text-maroon">
              Nothing called “{q}” yet.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                router.push(pathname, { scroll: false });
              }}
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-maroon px-6 text-[16px] text-on-maroon hover:bg-maroon-deep"
            >
              Show the whole menu
            </button>
          </div>
        ) : (
          <motion.ul layout className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((it, i) => (
                <motion.li
                  key={it.slug}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease, delay: i * 0.03 } }}
                  exit={{ opacity: 0, transition: { duration: 0.18 } }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      lastCard.current = e.currentTarget;
                      setOpen(it);
                    }}
                    className="group block w-full rounded-[22px] text-left"
                    aria-haspopup="dialog"
                  >
                    <DishImage
                      item={it}
                      available={available}
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="aspect-[4/3] rounded-[22px]"
                      imgClassName="transition-transform duration-500 ease-soft group-hover:scale-[1.04]"
                    />
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-[14px] text-ink/55">{categoryById[it.category]?.name}</span>
                      <DietMark diet={it.diet} />
                    </div>
                    <span className="mt-1 block text-[24px] font-light leading-tight text-maroon">{it.name}</span>
                    {it.description && (
                      <span className="mt-2 line-clamp-2 block text-[16px] leading-relaxed text-ink/75">{it.description}</span>
                    )}
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {pages > 1 && (
          <nav aria-label="Pages" className="mt-16 flex flex-wrap items-center justify-center gap-2">
            <PageButton disabled={page === 1} onClick={() => goPage(page - 1)} wide>
              Previous
            </PageButton>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <PageButton key={p} active={p === page} onClick={() => goPage(p)} label={`Page ${p}`}>
                {p}
              </PageButton>
            ))}
            <PageButton disabled={page === pages} onClick={() => goPage(page + 1)} wide>
              Next
            </PageButton>
          </nav>
        )}
      </section>

      <AnimatePresence>
        {open && <DishSheet key={open.slug} item={open} available={available} onClose={closeSheet} />}
      </AnimatePresence>
    </>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[15px] transition-colors ${
        active ? "bg-ink text-porcelain" : "bg-oat text-ink/80 hover:text-maroon"
      }`}
    >
      {children}
    </button>
  );
}

function PageButton({
  children,
  onClick,
  active,
  disabled,
  wide,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  wide?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-[44px] items-center justify-center rounded-full text-[16px] transition-colors disabled:opacity-35 ${
        wide ? "px-5" : "w-[44px]"
      } ${active ? "bg-maroon text-on-maroon" : "text-ink hover:bg-oat"}`}
    >
      {children}
    </button>
  );
}
