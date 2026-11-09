"use client";

import { useRef } from "react";
import { site } from "@/lib/site";
import { visitPhoto } from "@/lib/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import OrderButtons from "./OrderButtons";
import Photo from "./Photo";

function Steam() {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" className="h-[clamp(48px,6vw,90px)] w-auto text-maroon/40">
      {[20, 55, 90].map((x, i) => (
        <path
          key={x}
          d={`M${x} 85 C ${x - 14} 65, ${x + 14} 50, ${x} 30 S ${x - 10} 8, ${x + 2} 2`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="steam"
          style={{ animationDelay: `${i * 0.7}s` }}
        />
      ))}
      <style>{`
        .steam { stroke-dasharray: 90; stroke-dashoffset: 90; animation: steam 3.2s ease-in-out infinite; }
        @keyframes steam { 0% { stroke-dashoffset: 90; opacity: 0; } 30% { opacity: 1; } 100% { stroke-dashoffset: -90; opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .steam { animation: none; stroke-dashoffset: 0; } }
      `}</style>
    </svg>
  );
}

/**
 * Visit. "Come over" fills up with coffee as the section scrolls in (text
 * clipped to a rising liquid line with a gentle wave), steam curls above it,
 * the terrace photo drifts in its arch, and a band of place names glides by.
 */
export default function Visit({ src }: { src: string | null }) {
  const section = useRef<HTMLElement>(null);
  const row = "grid gap-1 border-t border-maroon/15 py-5 sm:grid-cols-[120px_1fr] sm:gap-6";
  const link = "inline-flex min-h-[44px] items-center text-maroon underline decoration-maroon/30 underline-offset-4 hover:decoration-maroon";

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      const title = q("[data-fill]")[0] as HTMLElement;
      if (prefersReducedMotion()) {
        title.style.setProperty("--fill", "100%");
        return;
      }
      gsap.fromTo(
        title,
        { "--fill": "0%" },
        {
          "--fill": "100%",
          ease: "none",
          scrollTrigger: { trigger: section.current, start: "top 75%", end: "top 15%", scrub: true },
        } as gsap.TweenVars,
      );
      gsap.fromTo(
        q("[data-row]"),
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: q("dl")[0], start: "top 80%" } },
      );
      gsap.fromTo(q("[data-photo]"), { yPercent: 10, scale: 1.12 }, {
        yPercent: -6,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(q("[data-band]"), { xPercent: 0 }, {
        xPercent: -30,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: section },
  );

  return (
    <section ref={section} id="visit" aria-labelledby="visit-title" className="relative scroll-mt-[72px] overflow-hidden bg-porcelain">
      <div className="mx-auto grid max-w-site gap-14 px-5 pb-16 pt-24 md:grid-cols-2 md:gap-20 md:px-8 md:pb-24 md:pt-36">
        <div>
          <Steam />
          <h2
            id="visit-title"
            data-fill
            className="text-[clamp(64px,9vw,150px)] font-light leading-[0.95] tracking-[-0.04em] text-transparent"
            style={{
              ["--fill" as string]: "0%",
              backgroundImage:
                "linear-gradient(to top, #5A1A14 0%, #5A1A14 var(--fill), rgba(90,26,20,0.14) var(--fill), rgba(90,26,20,0.14) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            Come over
          </h2>
          <dl className="mt-10 text-body">
            <div data-row className={row}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">Where</dt>
              <dd>
                <p className="pt-[8px]">{site.address ?? site.area}</p>
                <a href={site.mapsHref} target="_blank" rel="noopener noreferrer" className={link}>
                  Get directions<span className="sr-only"> in Google Maps, opens in a new tab</span>
                </a>
              </dd>
            </div>
            <div data-row className={row}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">When</dt>
              {/* TODO: opening hours from the café */}
              <dd className="pt-[8px]">{site.hours ?? "Opening hours coming soon. Call us to check."}</dd>
            </div>
            <div data-row className={row}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">Call</dt>
              <dd>
                <a href={site.phoneHref} className={`${link} text-[22px] font-light`}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div data-row className={`${row} border-b`}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">Follow</dt>
              <dd>
                <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className={link}>
                  {site.instagram}
                  <span className="sr-only"> on Instagram, opens in a new tab</span>
                </a>
              </dd>
            </div>
          </dl>

          <h3 className="mt-14 text-[clamp(26px,2.6vw,36px)] font-extralight text-maroon">Rather eat at home?</h3>
          <OrderButtons className="mt-6" />
        </div>

        <a
          href={site.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block self-start overflow-hidden rounded-[999px_999px_28px_28px] md:mt-24"
        >
          <div data-photo className="will-change-transform">
            <Photo
              src={src}
              alt={visitPhoto.alt}
              label={site.area}
              tint="#F3E3D0"
              sizes="(min-width: 900px) 600px, 92vw"
              className="aspect-[4/5]"
            />
          </div>
          <span className="fixed-palette absolute bottom-5 left-1/2 inline-flex min-h-[44px] -translate-x-1/2 items-center whitespace-nowrap rounded-full bg-fixed-porcelain px-5 text-[16px] text-fixed-maroon shadow-md">
            Open in Google Maps<span className="sr-only">, opens in a new tab</span>
          </span>
        </a>
      </div>

      {/* Drifting band of names */}
      <div aria-hidden="true" className="overflow-hidden border-y border-maroon/10 py-5">
        <div data-band className="whitespace-nowrap font-serif text-[clamp(28px,4vw,56px)] italic text-maroon/70">
          {Array.from({ length: 4 }, () => `Kondapur · Hyderabad · Betwēn Us · ${site.tagline} · `).join("")}
        </div>
      </div>
    </section>
  );
}
