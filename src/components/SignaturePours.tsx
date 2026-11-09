"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { drinks } from "@/lib/drinks";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { withBase } from "@/lib/base";
import { scrollToTarget } from "./SmoothScroll";
import OrderButtons from "./OrderButtons";

/**
 * Signature pours: a dark, spotlit product stage (Glacé-style reference).
 * The real drink photos (Higgsfield menu shots with the background removed) float
 * in the centre; a giant ghost name drifts behind; coffee beans float at three depths.
 * Scroll is scrubbed (no snapping): each drink rises in as the previous one drifts away,
 * and the spotlight takes on a soft tint of the current drink.
 */

const BEANS = [
  { x: 6, y: 18, s: 64, r: -30, d: 1.6, blur: 2 },
  { x: 88, y: 12, s: 52, r: 40, d: 1.2, blur: 1 },
  { x: 30, y: 74, s: 40, r: 15, d: 0.7, blur: 0 },
  { x: 72, y: 80, s: 70, r: -60, d: 1.8, blur: 3 },
  { x: 52, y: 8, s: 30, r: 70, d: 0.5, blur: 0 },
  { x: 94, y: 56, s: 36, r: -15, d: 0.9, blur: 0 },
  { x: 14, y: 52, s: 28, r: 25, d: 0.6, blur: 0 },
  { x: 40, y: 30, s: 22, r: -40, d: 0.4, blur: 1 },
];

function Bean({ size }: { size: number }) {
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 40 52" aria-hidden="true">
      <defs>
        <radialGradient id="bean-g" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#8A5534" />
          <stop offset="55%" stopColor="#4E2A17" />
          <stop offset="100%" stopColor="#21110A" />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="26" rx="17" ry="24" fill="url(#bean-g)" />
      <path d="M20 4 C 11 18, 29 34, 20 48" stroke="#1A0C06" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="13" cy="15" rx="4" ry="7" fill="#fff" opacity="0.12" />
    </svg>
  );
}

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(", ");
};

export default function SignaturePours() {
  const section = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const cups = useRef<(HTMLDivElement | null)[]>([]);
  const ghost = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const beans = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const drink = drinks[active];
  const n = drinks.length;

  // Place every cup for a continuous position p (0 … n-1).
  const render = (p: number) => {
    cups.current.forEach((el, i) => {
      if (!el) return;
      const t = p - i; // <0: still to come, 0: on stage, >0: leaving
      const a = Math.abs(t);
      const opacity = Math.max(0, 1 - a * 1.6);
      const y = t < 0 ? -t * 34 : -t * 10; // incoming rises from below
      const x = t > 0 ? -t * 18 : 0; // outgoing drifts left
      const scale = 1 - Math.min(a, 1) * 0.14;
      const rot = t * -5;
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(${x}vw, ${y}vh, 0) scale(${scale}) rotate(${rot}deg)`;
      el.style.visibility = opacity > 0.01 ? "visible" : "hidden";
    });
    if (ghost.current) ghost.current.style.transform = `translate3d(${-p * 6}vw, 0, 0)`;
    beans.current.forEach((el, i) => {
      if (!el) return;
      const b = BEANS[i];
      el.style.transform = `translate3d(0, ${-p * b.d * 9}vh, 0) rotate(${b.r + p * b.d * 40}deg)`;
    });
  };

  useGSAP(
    () => {
      render(0);
      if (prefersReducedMotion()) return;
      trigger.current = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.75 * n}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress * (n - 1);
          render(p);
          const i = Math.round(p);
          setActive((prev) => (prev === i ? prev : i));
        },
      });
    },
    { scope: section },
  );

  // Spotlight tint follows the active drink
  useGSAP(
    () => {
      if (!glow.current) return;
      gsap.to(glow.current, {
        "--glow": hexToRgb(drink.bg),
        duration: prefersReducedMotion() ? 0 : 0.8,
        ease: "power2.out",
        overwrite: "auto",
      } as gsap.TweenVars);
    },
    { dependencies: [active], scope: section },
  );

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) {
      setActive(i);
      render(i);
      return;
    }
    scrollToTarget(st.start + ((st.end - st.start) * i) / (n - 1));
  };

  return (
    <section
      ref={section}
      id="signature"
      aria-labelledby="signature-title"
      className="fixed-palette relative h-[100svh] overflow-hidden bg-[#140C09] text-[#F6EEE3]"
    >
      {/* Spotlight, tinted by the drink */}
      <div
        ref={glow}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={
          {
            "--glow": hexToRgb(drinks[0].bg),
            background:
              "radial-gradient(ellipse 42% 58% at 50% 56%, rgba(var(--glow), 0.38), rgba(var(--glow), 0.08) 55%, transparent 75%), radial-gradient(ellipse 70% 60% at 50% 40%, rgba(120, 72, 44, 0.22), transparent 70%)",
          } as CSSProperties
        }
      />

      {/* Giant ghost name */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[14%] overflow-hidden md:top-[10%]">
        <div ref={ghost} className="whitespace-nowrap pl-[8vw] font-serif text-[22vw] leading-none text-white/[0.06] md:text-[15vw]">
          {drinks.map((d) => d.name).join("  ·  ")}
        </div>
      </div>

      {/* Floating beans */}
      {BEANS.map((b, i) => (
        <div
          key={i}
          ref={(el) => {
            beans.current[i] = el;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: `${b.x}%`, top: `${b.y}%`, filter: b.blur ? `blur(${b.blur}px)` : undefined, opacity: 0.9 }}
        >
          <Bean size={b.s} />
        </div>
      ))}

      {/* The drinks */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-[17%] top-[16%] md:bottom-[4%] md:top-[12%]">
        {drinks.map((d, i) => (
          <div
            key={d.slug}
            ref={(el) => {
              cups.current[i] = el;
            }}
            className="absolute inset-0 flex items-end justify-center will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBase(`/drinks/${d.slug}.webp`)}
              alt=""
              loading={i < 2 ? "eager" : "lazy"}
              className="h-full w-auto max-w-[86vw] object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
            />
          </div>
        ))}
      </div>

      {/* Copy */}
      <div className="relative z-10 mx-auto flex h-full max-w-site flex-col justify-between px-5 pb-6 pt-[92px] md:flex-row md:items-center md:px-8 md:py-0">
        <div className="max-w-[440px]">
          <h2 id="signature-title" className="text-[15px] text-[#C49A7E]">
            Signature pours
          </h2>
          <div aria-live="polite">
            <p key={drink.slug} className="mt-2 animate-[sigIn_.35s_ease-out] text-[clamp(34px,4.6vw,64px)] font-extralight leading-[1.02] tracking-[-0.02em]">
              {drink.name}
            </p>
            <p className="mt-4 hidden max-w-[34ch] text-[16px] leading-relaxed text-[#F6EEE3]/75 md:block">{drink.description}</p>
          </div>
          <OrderButtons variant="outline" className="mt-7 hidden md:flex" context={drink.name} />
        </div>

        <div className="md:max-w-[360px] md:text-left">
          <p className="hidden font-serif text-[clamp(24px,2.4vw,34px)] italic leading-tight md:block">
            Slow brewed, poured to order.
          </p>
          <p className="mt-3 hidden text-[15px] text-[#F6EEE3]/65 md:block">Pick a drink or keep scrolling.</p>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 md:flex-wrap" role="group" aria-label="Choose a drink">
            {drinks.map((d, i) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={d.name}
                aria-current={i === active ? "true" : undefined}
                className={`relative h-[78px] w-[60px] shrink-0 overflow-hidden rounded-[14px] border transition-all duration-300 md:h-[92px] md:w-[70px] ${
                  i === active ? "border-[#C49A7E] bg-white/[0.08]" : "border-white/15 bg-white/[0.03] hover:border-white/40"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBase(`/drinks/${d.slug}.webp`)} alt="" className="absolute inset-1 h-[calc(100%-8px)] w-[calc(100%-8px)] object-contain" />
              </button>
            ))}
          </div>
          <Link
            href="/menu?group=coffee"
            className="mt-5 inline-flex min-h-[44px] items-center rounded-full border border-[#F6EEE3]/40 px-6 text-[15px] transition-colors hover:bg-white/10"
          >
            See all coffee
          </Link>
        </div>
      </div>
    </section>
  );
}
