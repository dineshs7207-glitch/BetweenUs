"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Photo from "./Photo";

export type FieldNote = {
  slug: string;
  name: string;
  no?: number;
  bg: string;
  effects?: string[];
  note?: string;
  src: string | null;
  alt: string;
};

export default function FieldNotes({ notes }: { notes: FieldNote[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} id="field-notes" aria-labelledby="notes-title" className="overflow-hidden bg-porcelain">
      <div className="flex min-h-[100svh] items-center py-24 md:py-0">
        <div
          ref={track}
          className="flex w-full flex-col gap-6 px-5 md:w-max md:flex-row md:items-stretch md:gap-8 md:pl-[max(32px,calc((100vw-1280px)/2+32px))] md:pr-[12vw]"
        >
          <div className="flex flex-col justify-center md:w-[400px] md:shrink-0 md:pr-8">
            <h2 id="notes-title" className="text-section font-extralight tracking-[-0.02em] text-maroon">
              Field notes
            </h2>
            <p className="mt-6 max-w-[34ch] text-body text-ink/75">
              What our kitchen is proud of this season, and what tends to happen at the table once it
              arrives.
            </p>
            <div className="mt-8">
              <Link
                href="/menu"
                className="inline-flex min-h-[44px] items-center rounded-full bg-maroon px-6 text-[16px] text-on-maroon transition-colors hover:bg-maroon-deep"
              >
                Browse the full menu
              </Link>
            </div>
          </div>

          {notes.map((n) => (
            <article
              key={n.slug}
              className="fixed-palette flex w-full flex-col rounded-[28px] p-5 text-fixed-maroon md:h-[min(78svh,700px)] md:w-[min(440px,38vw)] md:shrink-0 md:p-6"
              style={{ backgroundColor: n.bg }}
              aria-labelledby={`note-${n.slug}`}
            >
              <div className="flex items-baseline justify-between text-[14px] text-fixed-maroon/75">
                <span>Betwēn Us, Field Notes</span>
                {n.no && <span>No. {n.no}</span>}
              </div>
              <h3 id={`note-${n.slug}`} className="mt-4 text-[clamp(30px,3vw,44px)] font-extralight leading-[1.05] tracking-[-0.01em]">
                {n.name}
              </h3>
              {n.note && <p className="mt-2 text-[16px] text-fixed-maroon/75">{n.note}</p>}
              <div className="relative mt-5 flex-1">
                <Photo
                  src={n.src}
                  alt={n.alt}
                  label="Photo coming soon"
                  tint="rgba(255,253,249,0.45)"
                  sizes="(min-width: 900px) 440px, 92vw"
                  className="aspect-square rounded-[20px] md:absolute md:inset-0 md:aspect-auto"
                />
                {n.effects && (
                  <div className="absolute bottom-3 left-3 right-3 rounded-[16px] bg-fixed-porcelain/95 px-4 py-3 text-fixed-ink shadow-sm md:right-auto md:max-w-[85%]">
                    <p className="text-[13px] text-fixed-ink/60">Observed effects</p>
                    <ul className="mt-1 font-serif text-[19px] italic leading-snug">
                      {n.effects.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
