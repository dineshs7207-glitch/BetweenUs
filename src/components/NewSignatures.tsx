"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import Photo from "./Photo";

// Soft ube "bubbles" that drift up at different depths (x %, size px, speed, blur px)
const BUBBLES = [
  [8, 90, 1.4, 6], [22, 40, 0.8, 0], [37, 140, 1.8, 14], [55, 30, 0.6, 0], [68, 70, 1.1, 3],
  [82, 120, 1.6, 10], [92, 36, 0.7, 0], [15, 26, 0.5, 0], [74, 24, 0.5, 0], [46, 60, 1.0, 2],
] as const;

/**
 * The Purple Dream (the café's Ube collection). Pinned scene: the page floods
 * from porcelain to ube purple, the poster rises out of a 3D tilt into a big
 * rounded card, a giant outlined "Purple Dream" drifts behind, and soft ube
 * bubbles float up at different depths. The copy settles in last.
 */
export default function NewSignatures({ src }: { src: string | null }) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      if (prefersReducedMotion()) {
        gsap.set(section.current, { backgroundColor: "#3C1F5E" });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=160%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(section.current, { backgroundColor: "#FFFDF9" }, { backgroundColor: "#3C1F5E", duration: 0.35 }, 0)
        .fromTo(q("[data-intro]"), { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.2 }, 0.12)
        .fromTo(
          q("[data-card]"),
          { rotateX: 38, rotateZ: -6, scale: 0.55, yPercent: 40, opacity: 0.2 },
          { rotateX: 0, rotateZ: 0, scale: 1, yPercent: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
          0.1,
        )
        .fromTo(q("[data-ghost]"), { xPercent: 10 }, { xPercent: -45, duration: 1 }, 0)
        .fromTo(q("[data-ghost]"), { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.2)
        .fromTo(q("[data-copy] > *"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.06, duration: 0.18, ease: "power2.out" }, 0.55);
      q("[data-bubble]").forEach((el) => {
        const speed = Number((el as HTMLElement).dataset.speed);
        tl.fromTo(el, { y: "30vh" }, { y: `${-90 * speed}vh`, duration: 1 }, 0);
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-labelledby="ube-title"
      className="fixed-palette relative overflow-hidden bg-[#3C1F5E] text-[#F3EAFE] md:h-[100svh]"
      style={{ perspective: "1400px" }}
    >
      {/* Ghost title */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <div
          data-ghost
          className="whitespace-nowrap font-serif text-[30vw] italic leading-none text-transparent md:text-[20vw]"
          style={{ WebkitTextStroke: "1.5px rgba(214, 190, 245, 0.35)" }}
        >
          Purple Dream · Purple Dream
        </div>
      </div>

      {/* Bubbles */}
      {BUBBLES.map(([x, s, speed, blur], i) => (
        <span
          key={i}
          data-bubble
          data-speed={speed}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 rounded-full"
          style={{
            left: `${x}%`,
            width: s,
            height: s,
            filter: blur ? `blur(${blur}px)` : undefined,
            background: "radial-gradient(circle at 30% 30%, rgba(236,222,255,.55), rgba(150,104,214,.35) 55%, rgba(90,50,150,.1))",
          }}
        />
      ))}

      {/* Opening line, before the flood */}
      <p
        data-intro
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[18%] hidden text-center text-[clamp(28px,4vw,60px)] font-extralight tracking-[-0.02em] text-maroon md:block"
      >
        Something new is brewing.
      </p>

      <div className="relative z-10 mx-auto grid h-full max-w-site items-center gap-10 px-5 py-20 md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-8 md:py-0">
        <div data-card style={{ transformStyle: "preserve-3d" }} className="will-change-transform">
          <Photo
            src={src}
            alt="Four layered ube drinks in ribbed glasses, purple yam over milk, topped with coconut, matcha and edible flowers, on a lilac background"
            label="Ube collection"
            tint="#E6DDF1"
            sizes="(min-width: 900px) 640px, 92vw"
            className="aspect-[1280/910] rounded-[28px] shadow-[0_50px_120px_rgba(20,6,40,0.55)]"
          />
        </div>
        <div data-copy>
          <p className="text-[15px] text-[#D6BEF5]">New signatures</p>
          <h2 id="ube-title" className="mt-3 text-section font-extralight tracking-[-0.02em]">
            The Purple Dream
          </h2>
          <p className="mt-6 max-w-[34ch] font-serif text-[clamp(22px,2.2vw,30px)] italic leading-snug text-[#F3EAFE]/90">
            An ode to the humble purple yam, crafted into silky lattes and indulgent drinks that blur
            the line betwēn comfort and luxury.
          </p>
          <p className="mt-6 text-body text-[#F3EAFE]/75">Creamy, earthy, vibrant.</p>
        </div>
      </div>
    </section>
  );
}
