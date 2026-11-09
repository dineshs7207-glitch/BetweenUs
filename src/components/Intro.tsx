"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrubLoop } from "@/lib/sound";

const LINE =
  "A café in Kondapur for slow coffee, food from the wok and the wood fire, and the conversations that happen in betwēn.";

const FEATHER =
  "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent), linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)";

/**
 * About line. Pinned: as you scroll, the words light up one by one (Apple-style)
 * while a Higgsfield film of a burr grinder splits apart into its parts.
 */
export default function Intro({ film }: { film?: { src: string; poster: string } | null }) {
  const section = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useRef({ p: 0 });

  // Scrub the grinder film
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let cur = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!v.duration || v.seeking || v.readyState < 1) return;
      cur += (progress.current.p - cur) * 0.18;
      const t = Math.min(cur, 0.995) * v.duration;
      if (Math.abs(v.currentTime - t) > 0.012) {
        try { v.currentTime = t; } catch {}
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      const words = q("[data-w]");
      if (prefersReducedMotion()) {
        gsap.set(words, { opacity: 1 });
        progress.current.p = 1;
        return;
      }
      const grind = scrubLoop("grind", 0.5);
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=150%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(progress.current, {
        p: 1,
        duration: 1,
        onUpdate: () => grind.feed(progress.current.p, progress.current.p > 0.05 && progress.current.p < 0.97),
      }, 0)
        .fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.035, duration: 0.12 }, 0.02)
        .fromTo(q("[data-sub]"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.15 }, 0.78);
      return () => grind.stop();
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="about-title"
      className="fixed-palette relative overflow-hidden bg-[#F1E4D6] md:h-[100svh]"
    >
      <div className="mx-auto grid h-full max-w-site items-center gap-6 px-5 pb-16 pt-24 md:grid-cols-[1fr_1.1fr] md:gap-10 md:px-8 md:py-0">
        <div className="relative z-10">
          <h2
            id="about-title"
            className="max-w-[22ch] text-[clamp(28px,3.6vw,54px)] font-extralight leading-[1.14] tracking-[-0.015em] text-maroon"
          >
            {LINE.split(" ").map((w, i) => (
              <span key={i} data-w className="inline-block whitespace-pre">
                {w}{" "}
              </span>
            ))}
          </h2>
          <p data-sub className="mt-8 max-w-[46ch] text-body text-ink/75">
            Café, Continental, Indo-Chinese and desserts, under one maroon ceiling. Come for a quick
            espresso or stay the whole evening.
          </p>
        </div>

        {film && (
          <div aria-hidden="true" className="relative -mx-5 aspect-[16/11] md:mx-0 md:aspect-auto md:h-[86svh]">
            <video
              ref={videoRef}
              src={film.src}
              poster={film.poster}
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ WebkitMaskImage: FEATHER, maskImage: FEATHER, WebkitMaskComposite: "source-in", maskComposite: "intersect" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
