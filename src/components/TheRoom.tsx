"use client";

import { useRef } from "react";
import type { Photo as PhotoT } from "@/lib/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Photo from "./Photo";

type P = PhotoT & { src: string | null };

const tints = ["#F6EEE3", "#EFE6D4", "#E7EEDF", "#F3E3D0", "#E6EBD9", "#F7E3E0"];
const GAP = 850; // px between photos along the camera axis

/**
 * The room: a camera walks through the café. Photos hang in 3D space at
 * alternating sides and depths; scrolling dollies the camera forward so each
 * one grows, drifts past and fades behind you, the way you'd take in a room.
 * Reduced motion: a plain grid.
 */
export default function TheRoom({ rowOne, rowTwo }: { rowOne: P[]; rowTwo: P[] }) {
  const list = Array.from(new Map([...rowOne, ...rowTwo].map((p) => [p.file, p])).values());
  const n = list.length;
  const section = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(section);
      const phone = window.innerWidth < 768;
      // Fixed layout: alternate sides, a little vertical wander
      const layout = list.map((_, i) => ({
        x: (i % 2 === 0 ? -1 : 1) * (phone ? 22 : 24 + (i % 3) * 5),
        y: ((i * 37) % 21) - 10,
        r: (i % 2 === 0 ? 1 : -1) * (2 + (i % 3)),
      }));
      const depth = (n + 1) * GAP;

      const place = (p: number) => {
        const cam = p * depth;
        cards.current.forEach((el, i) => {
          if (!el) return;
          const z = -(i + 1) * GAP + cam; // 0 = at the lens
          const L = layout[i];
          const far = Math.min(1, Math.max(0, (z + GAP * 4.2) / (GAP * 1.6))); // fade in from the distance
          const near = Math.min(1, Math.max(0, (GAP * 0.55 - z) / (GAP * 0.45))); // fade as it passes
          const o = far * near;
          el.style.opacity = String(o);
          el.style.visibility = o > 0.01 ? "visible" : "hidden";
          el.style.transform = `translate3d(calc(-50% + ${L.x}vw), calc(-50% + ${L.y}vh), ${z}px) rotateY(${-L.x * 0.35}deg) rotateZ(${L.r}deg)`;
        });
      };
      place(0);

      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 0.55 * n}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => place(self.progress),
        },
      })
        .to(q("[data-title]"), { opacity: 0, scale: 1.6, duration: 0.12 }, 0.02)
        .fromTo(q("[data-end]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.08 }, 0.92);
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="room"
      aria-labelledby="room-title"
      className="fixed-palette relative scroll-mt-[72px] overflow-hidden bg-[#1E110D] text-[#F6EEE3] motion-safe:h-[100svh]"
    >
      {/* Warm pool of light, like the café's pendants */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(196,154,126,0.28), transparent 70%)" }}
      />

      {/* Opening title */}
      <div data-title className="pointer-events-none absolute inset-0 z-20 hidden flex-col items-center justify-center text-center motion-safe:flex">
        <h2 id="room-title" className="text-[clamp(56px,11vw,180px)] font-extralight leading-none tracking-[-0.03em]">
          The room
        </h2>
        <p className="mt-6 max-w-[44ch] px-6 text-body text-[#F6EEE3]/75">
          Maroon ceilings, a checkered floor, rattan lights and more plants than we can count. Keep
          scrolling to walk in.
        </p>
      </div>

      {/* 3D stage */}
      <div className="absolute inset-0 hidden motion-safe:block" style={{ perspective: "900px" }}>
        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {list.map((p, i) => (
            <div
              key={p.file}
              ref={(el) => {
                cards.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 w-[min(72vw,340px)] will-change-transform md:w-[42vw] md:max-w-[720px]"
              style={{ opacity: 0 }}
            >
              <Photo
                src={p.src}
                alt={p.alt}
                label={p.label}
                tint={tints[i % tints.length]}
                sizes="(min-width: 900px) 560px, 64vw"
                className="aspect-[4/3] rounded-[18px] shadow-[0_40px_90px_rgba(0,0,0,0.5)]"
              />
              {p.label && <p className="mt-3 font-serif text-[18px] italic text-[#F6EEE3]/80">{p.label}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Closing line */}
      <p
        data-end
        className="pointer-events-none absolute inset-x-0 bottom-[12%] z-20 hidden text-center text-[clamp(26px,3.2vw,46px)] font-extralight motion-safe:block"
        style={{ opacity: 0 }}
      >
        Pick a booth, the balcony or the garden terrace.
      </p>

      {/* Reduced motion: a simple grid */}
      <div className="mx-auto max-w-site px-5 py-24 motion-safe:hidden md:px-8">
        <h2 className="text-section font-extralight tracking-[-0.02em]">The room</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {list.map((p, i) => (
            <Photo key={p.file} src={p.src} alt={p.alt} label={p.label} tint={tints[i % tints.length]} sizes="(min-width: 900px) 33vw, 50vw" className="aspect-[4/3] rounded-[18px]" />
          ))}
        </div>
      </div>
    </section>
  );
}
