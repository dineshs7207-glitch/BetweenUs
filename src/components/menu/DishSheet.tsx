"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { categoryById, proteinsFor, type MenuItem } from "@/lib/menu";
import OrderButtons from "../OrderButtons";
import { lockScroll } from "../SmoothScroll";
import DishImage from "./DishImage";
import DietMark from "./DietMark";

const ease = [0.22, 1, 0.36, 1] as const;

type Props = { item: MenuItem; available: Set<string>; onClose: () => void };

export default function DishSheet({ item, available, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const cat = categoryById[item.category];
  const proteins = proteinsFor(item);

  useEffect(() => {
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        // Trap focus inside the dialog
        const f = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-8">
      <motion.div
        className="absolute inset-0 bg-[#1A0906]/55 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-title"
        data-lenis-prevent
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease }}
        className="relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-porcelain pb-[env(safe-area-inset-bottom)] shadow-2xl md:grid md:max-w-[880px] md:grid-cols-2 md:rounded-[28px]"
      >
        <DishImage
          item={item}
          available={available}
          sizes="(min-width: 900px) 440px, 100vw"
          className="aspect-[4/3] md:aspect-auto md:min-h-[460px]"
        />
        <div className="flex flex-col p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <p className="pt-3 text-[14px] text-ink/60">{cat?.name}</p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="-mr-2 -mt-1 inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full text-maroon hover:bg-oat"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <h2 id="dish-title" className="mt-1 text-[clamp(30px,3.4vw,40px)] font-extralight leading-[1.08] text-maroon">
            {item.name}
          </h2>
          <div className="mt-3">
            <DietMark diet={item.diet} />
          </div>
          {item.description && <p className="mt-4 text-body text-ink/80">{item.description}</p>}
          {cat?.note && <p className="mt-3 font-serif text-[20px] italic text-ink/70">{cat.note}</p>}
          {proteins && (
            <div className="mt-6">
              <p className="text-[14px] text-ink/60">Protein options</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {proteins.map((p) => (
                  <li key={p} className="rounded-full bg-oat px-4 py-2 text-[15px] text-ink">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-auto pt-8">
            <OrderButtons context={item.name} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
