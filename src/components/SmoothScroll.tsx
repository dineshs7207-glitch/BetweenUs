"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenis: Lenis | null = null;
let locks = 0;

/** Stop/start smooth scrolling (loader, dish sheet, mobile menu). Counted, so nested locks are safe. */
export function lockScroll(locked: boolean) {
  locks = Math.max(0, locks + (locked ? 1 : -1));
  const on = locks > 0;
  if (lenis) {
    if (on) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = on ? "hidden" : "";
}

/** Jump straight to the top (every visit starts on the hero). */
export function resetToTop() {
  try { history.scrollRestoration = "manual"; } catch {}
  lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.1 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el instanceof HTMLElement) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    resetToTop();
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ lerp: 0.14, wheelMultiplier: 1.1, touchMultiplier: 1.4, anchors: { offset: -72 } });
    lenis = instance;
    if (locks > 0) instance.stop();

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return <>{children}</>;
}
