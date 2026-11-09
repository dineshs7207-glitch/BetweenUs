"use client";

import { useRef } from "react";
import { site } from "@/lib/site";
import { loungePhoto } from "@/lib/gallery";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Photo from "./Photo";

function Door({ side }: { side: "left" | "right" }) {
  return (
    <div
      data-door={side}
      aria-hidden="true"
      className={`absolute inset-y-0 w-1/2 bg-[#4A140F] will-change-transform ${side === "left" ? "left-0 origin-left" : "right-0 origin-right"}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(0,0,0,.18), transparent 30%, transparent 70%, rgba(0,0,0,.18)), repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 2px, transparent 2px 9px)",
      }}
    >
      {/* Panel mouldings and the brass handle */}
      <div className="absolute inset-[7%] rounded-[999px_999px_18px_18px] border border-[#C49A7E]/30" />
      <div className="absolute inset-[11%] rounded-[999px_999px_14px_14px] border border-[#C49A7E]/15" />
      <div className={`absolute top-1/2 h-[18%] w-[6px] -translate-y-1/2 rounded-full bg-gradient-to-b from-[#E2C29A] via-[#B8895C] to-[#7C5434] shadow-[0_0_18px_rgba(226,194,154,.35)] ${side === "left" ? "right-[5%]" : "left-[5%]"}`} />
    </div>
  );
}

/**
 * The private lounge. Pinned: two maroon doors swing open on scroll, the room
 * behind them eases from a close crop back to the full view, and the details
 * fade up once you're "inside".
 */
export default function Lounge({ src }: { src: string | null }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      if (prefersReducedMotion()) {
        gsap.set(q("[data-door]"), { display: "none" });
        return;
      }
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=140%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(q("[data-knock]"), { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.04)
        .to(q("[data-door='left']"), { rotateY: 78, xPercent: -18, duration: 0.5, ease: "power2.inOut" }, 0.06)
        .to(q("[data-door='right']"), { rotateY: -78, xPercent: 18, duration: 0.5, ease: "power2.inOut" }, 0.06)
        .fromTo(q("[data-room]"), { scale: 1.35 }, { scale: 1, duration: 0.75, ease: "power1.out" }, 0.06)
        .fromTo(q("[data-shade]"), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.5)
        .fromTo(q("[data-copy] > *"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.15, ease: "power2.out" }, 0.58);
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="lounge"
      aria-labelledby="lounge-title"
      className="fixed-palette on-dark relative h-[100svh] min-h-[600px] scroll-mt-[72px] overflow-hidden bg-[#1A0906] text-fixed-porcelain"
    >
      <div data-room className="absolute inset-0 will-change-transform">
        <Photo src={src} alt={loungePhoto.alt} label={loungePhoto.label} tint="#5A1A14" sizes="100vw" className="h-full w-full" />
      </div>
      <div
        data-shade
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(26,9,6,.88),rgba(26,9,6,.55)_45%,rgba(26,9,6,.1))]"
      />

      {/* The doors */}
      <div className="absolute inset-0 z-10" style={{ perspective: "1600px" }}>
        <Door side="left" />
        <Door side="right" />
        <p data-knock aria-hidden="true" className="absolute inset-x-0 top-[44%] text-center font-serif text-[clamp(26px,3vw,42px)] italic text-[#E2C29A]">
          Private lounge
        </p>
      </div>

      <div className="relative z-20 mx-auto flex h-full max-w-site items-end px-5 pb-16 md:items-center md:px-8 md:pb-0">
        <div data-copy className="max-w-[520px]">
          <p className="text-[15px] text-[#E2C29A]">Behind the door</p>
          <h2 id="lounge-title" className="mt-3 text-section font-extralight tracking-[-0.02em]">
            The private lounge
          </h2>
          <p className="mt-6 max-w-[46ch] text-body text-fixed-porcelain/85">
            A separate room with deep sofas and its own screen, for birthdays, team evenings and small
            celebrations. Tell us the date and the headcount and we will plan the food and drinks with
            you.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={site.phoneHref}
              className="inline-flex min-h-[52px] items-center rounded-full bg-fixed-porcelain px-7 text-[17px] text-fixed-maroon transition-colors hover:bg-oat"
            >
              Call {site.phone}
            </a>
            <a
              href={site.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center rounded-full border border-fixed-porcelain/60 px-7 text-[17px] transition-colors hover:bg-fixed-porcelain/10"
            >
              Message us on Instagram<span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
