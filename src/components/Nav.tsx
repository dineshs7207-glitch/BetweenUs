"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";
import { Monogram, Wordmark } from "./Monogram";
import { lockScroll } from "./SmoothScroll";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/#room", label: "The room" },
  { href: "/#lounge", label: "Private lounge" },
  { href: "/#visit", label: "Visit" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const orderRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Order popover: close on outside click and Escape
  useEffect(() => {
    if (!orderOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!orderRef.current?.contains(e.target as Node)) setOrderOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOrderOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [orderOpen]);

  // Mobile panel: lock scroll, Escape closes
  useEffect(() => {
    if (!menuOpen) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => setMenuOpen(false), [pathname]);

  const solid = scrolled || menuOpen || pathname !== "/";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid
          ? "bg-porcelain/85 shadow-[0_1px_0_rgb(var(--maroon)/0.12)] backdrop-blur-md"
          : "bg-transparent motion-reduce:bg-porcelain/85 motion-reduce:backdrop-blur-md"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <a
        href="#main"
        className="sr-only-focusable absolute left-4 top-3 z-10 rounded-full bg-maroon px-4 py-2 text-on-maroon"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[72px] max-w-site items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className="flex min-h-[44px] items-center gap-3 text-maroon"
          aria-label={`${site.name}, home`}
        >
          <Monogram className="h-9" />
          <Wordmark className="hidden text-[17px] xs:inline-block" />
        </Link>

        <nav aria-label="Main" className="hidden nav:block">
          <ul className="flex items-center gap-1 text-[16px]">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-flex min-h-[44px] items-center rounded-full px-4 text-ink/80 transition-colors hover:bg-oat hover:text-maroon"
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div ref={orderRef} className="relative">
            <button
              type="button"
              aria-expanded={orderOpen}
              aria-controls="order-popover"
              onClick={() => setOrderOpen((o) => !o)}
              className="inline-flex min-h-[44px] items-center rounded-full bg-maroon px-5 text-[16px] text-on-maroon transition-colors hover:bg-maroon-deep"
            >
              Order online
            </button>
            <AnimatePresence>
              {orderOpen && (
                <motion.div
                  id="order-popover"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2, ease }}
                  className="absolute right-0 top-[calc(100%+10px)] w-[230px] origin-top-right rounded-[20px] bg-porcelain p-2 shadow-[0_18px_50px_-12px_rgb(42_23_20/0.35)] ring-1 ring-maroon/10"
                >
                  {[
                    { href: site.order.swiggy, label: "Order on Swiggy" },
                    { href: site.order.zomato, label: "Order on Zomato" },
                  ].map((o) => (
                    <a
                      key={o.label}
                      href={o.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOrderOpen(false)}
                      className="flex min-h-[48px] items-center rounded-[14px] px-4 text-[16px] text-ink hover:bg-oat hover:text-maroon"
                    >
                      {o.label}
                      <span className="sr-only">, opens in a new tab</span>
                    </a>
                  ))}
                  <a
                    href={site.phoneHref}
                    className="flex min-h-[48px] items-center rounded-[14px] px-4 text-[15px] text-ink/70 hover:bg-oat hover:text-maroon"
                  >
                    Or call {site.phone}
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            ref={burgerRef}
            type="button"
            className="relative inline-flex h-[44px] w-[44px] items-center justify-center rounded-full text-maroon hover:bg-oat nav:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span
              className={`absolute h-[1.5px] w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "rotate-45" : "-translate-y-[4px]"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-6 bg-current transition-transform duration-300 ${
                menuOpen ? "-rotate-45" : "translate-y-[4px]"
              }`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Main"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden bg-porcelain/95 backdrop-blur-md nav:hidden"
          >
            <ul className="mx-auto max-w-site px-5 pb-8 pt-2">
              {links.map((l) => (
                <li key={l.href} className="border-b border-maroon/10">
                  <Link
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-[60px] items-center text-[24px] font-extralight text-maroon"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-5 text-[16px] text-ink/75">
                <a href={site.phoneHref} className="inline-flex min-h-[44px] items-center">
                  Call {site.phone}
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
