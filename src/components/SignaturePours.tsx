"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { drinks as allDrinks } from "@/lib/drinks";
import { ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { withBase } from "@/lib/base";
import { scrollToTarget } from "./SmoothScroll";
import OrderButtons from "./OrderButtons";

/**
 * Signature pours, "Choose your drink" (POUR / PLAY reference).
 * Cream stage, a giant bold drink name sliding behind, the drink in front.
 * Drinks with a Higgsfield "split" clip (public/video/split-<slug>.mp4) fly apart
 * into their layers as you scroll and the next drink pulls together from its own
 * pieces (its clip played backwards). Drinks without a clip cross-fade.
 */

const STAGE_BG = "#F3DCC3";
// Soft square edges so the clip's backdrop melts into the stage
const EDGE_FADE =
  "linear-gradient(to right, transparent, #000 9%, #000 91%, transparent), linear-gradient(to bottom, transparent, #000 4%, #000 92%, transparent)";
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const ease = (x: number) => x * x * (3 - 2 * x);
const shortName = (name: string) => name.replace(/ (Cold Brew|Latte)$/, "");

export default function SignaturePours({ splits = [] }: { splits?: string[] }) {
  // Drinks with a split clip lead, so the effect is seen first
  const drinks = useMemo(
    () => [...allDrinks].sort((a, b) => Number(splits.includes(b.slug)) - Number(splits.includes(a.slug))),
    [splits],
  );
  const n = drinks.length;
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const target = useRef<number[]>(drinks.map(() => 0)); // wanted clip position 0..1 per drink
  const [active, setActive] = useState(0);
  const drink = drinks[active];

  // p runs 0 … n-1. Between drink i and i+1: i splits apart (first half),
  // then i+1 assembles (second half). A short hold keeps each drink whole.
  const render = (p: number) => {
    const i = Math.min(Math.floor(p), n - 2);
    const f = p - i;
    const out = ease(clamp((f - 0.08) / 0.42)); // 0 → 1: drink i splits
    const inn = ease(clamp((0.92 - f) / 0.42)); // 1 → 0: drink i+1 re-assembles
    const swap = clamp((f - 0.44) / 0.12); // cross-fade at the fully split moment

    drinks.forEach((d, k) => {
      const el = layers.current[k];
      if (!el) return;
      let o = 0;
      let split = 0;
      if (k === i) { o = 1 - swap; split = out; }
      else if (k === i + 1) { o = swap; split = inn; }
      const hasClip = splits.includes(d.slug);
      // Without a clip, fake the motion: lift and shrink a little
      const lift = hasClip ? 0 : split * -6;
      const scale = hasClip ? 1 : 1 - split * 0.08;
      el.style.opacity = String(o);
      el.style.visibility = o > 0.01 ? "visible" : "hidden";
      el.style.transform = `translate3d(0, ${lift}vh, 0) scale(${scale})`;
      target.current[k] = split;
    });
    if (strip.current) strip.current.style.transform = `translate3d(${-p * 100}vw, 0, 0)`;
  };

  // Scrub each clip toward its target without queueing seeks
  useEffect(() => {
    let raf = 0;
    const cur = drinks.map(() => 0);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      videos.current.forEach((v, k) => {
        if (!v || !v.duration || v.seeking || v.readyState < 1) return;
        cur[k] += (target.current[k] - cur[k]) * 0.25;
        const t = Math.min(cur[k], 0.995) * v.duration;
        if (Math.abs(v.currentTime - t) > 0.015) {
          try { v.currentTime = t; } catch {}
        }
      });
    };
    raf = requestAnimationFrame(tick);
    const prime = () =>
      videos.current.forEach((v) => {
        try { v?.play().then(() => v.pause()).catch(() => {}); } catch {}
      });
    window.addEventListener("touchstart", prime, { once: true, passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("touchstart", prime);
    };
  }, [drinks]);

  useGSAP(
    () => {
      render(0);
      if (prefersReducedMotion()) return;
      trigger.current = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.9 * (n - 1)}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress * (n - 1);
          render(p);
          const k = Math.round(p);
          setActive((prev) => (prev === k ? prev : k));
        },
      });
    },
    { scope: section, dependencies: [drinks] },
  );

  const goTo = (k: number) => {
    const st = trigger.current;
    if (!st) {
      setActive(k);
      render(Math.min(k, n - 1));
      return;
    }
    scrollToTarget(st.start + ((st.end - st.start) * k) / (n - 1));
  };

  return (
    <section
      ref={section}
      id="signature"
      aria-labelledby="signature-title"
      className="fixed-palette relative h-[100svh] overflow-hidden text-ink"
      style={{ background: `radial-gradient(ellipse 70% 70% at 50% 55%, #F8E6D2, ${STAGE_BG} 60%, #EED2B5)` }}
    >
      {/* Giant bold drink names, sliding behind the drink */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[22%] overflow-hidden md:top-1/2 md:-translate-y-1/2">
        <div ref={strip} className="flex will-change-transform">
          {drinks.map((d) => (
            <span
              key={d.slug}
              className="w-screen shrink-0 text-center text-[clamp(72px,19vw,300px)] font-semibold leading-none tracking-[-0.045em] text-maroon"
            >
              {shortName(d.name)}
            </span>
          ))}
        </div>
      </div>

      {/* The drink */}
      <div aria-hidden="true" className="absolute left-1/2 top-[54%] aspect-square w-[min(118vw,62svh)] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:w-[min(46vw,82svh)]">
        {drinks.map((d, k) => {
          const hasClip = splits.includes(d.slug);
          return (
            <div
              key={d.slug}
              ref={(el) => {
                layers.current[k] = el;
              }}
              className="absolute inset-0 will-change-transform"
              style={{
                opacity: k === 0 ? 1 : 0,
                WebkitMaskImage: EDGE_FADE,
                maskImage: EDGE_FADE,
                WebkitMaskComposite: "source-in",
                maskComposite: "intersect",
              }}
            >
              {hasClip ? (
                <video
                  ref={(el) => {
                    videos.current[k] = el;
                  }}
                  src={withBase(`/video/split-${d.slug}.mp4`)}
                  poster={withBase(`/video/split-${d.slug}.jpg`)}
                  muted
                  playsInline
                  preload={k < 3 ? "auto" : "metadata"}
                  tabIndex={-1}
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={withBase(`/menu/${d.slug}.webp`)} alt="" loading="lazy" className="h-full w-full object-cover" />
              )}
            </div>
          );
        })}
      </div>

      {/* Copy */}
      <div className="relative z-10 mx-auto flex h-full max-w-site flex-col justify-between px-5 pb-6 pt-[92px] md:flex-row md:items-end md:px-8 md:pb-14">
        <div className="max-w-[360px]">
          <h2 id="signature-title" className="text-[15px] text-maroon/80">
            Choose your drink
          </h2>
          <div aria-live="polite">
            <p key={drink.slug} className="mt-1 animate-[sigIn_.35s_ease-out] text-[clamp(26px,2.6vw,38px)] font-light leading-[1.08] tracking-[-0.01em]">
              {drink.name}
            </p>
            <p className="mt-3 hidden max-w-[32ch] text-[15px] leading-relaxed text-ink/70 md:block">{drink.description}</p>
          </div>
          <OrderButtons className="mt-6 hidden md:flex" context={drink.name} />
        </div>

        <div className="md:max-w-[300px] md:text-right">
          <p className="hidden font-serif text-[clamp(22px,2vw,30px)] italic leading-tight text-maroon md:block">
            Slow brewed, poured to order.
          </p>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:justify-end" role="group" aria-label="Choose a drink">
            {drinks.map((d, k) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => goTo(k)}
                aria-label={d.name}
                aria-current={k === active ? "true" : undefined}
                className={`relative h-[70px] w-[56px] shrink-0 overflow-hidden rounded-[14px] border transition-all duration-300 md:h-[84px] md:w-[64px] ${
                  k === active ? "border-maroon bg-white/60" : "border-maroon/15 bg-white/25 hover:border-maroon/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBase(`/drinks/${d.slug}.webp`)} alt="" className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] object-contain" />
              </button>
            ))}
          </div>
          <Link
            href="/menu?group=coffee"
            className="mt-4 inline-flex min-h-[44px] items-center rounded-full border border-maroon/40 px-6 text-[15px] text-maroon transition-colors hover:bg-white/40"
          >
            See all coffee
          </Link>
        </div>
      </div>
    </section>
  );
}
