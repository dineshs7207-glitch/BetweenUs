"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { drinks } from "@/lib/drinks";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "./SmoothScroll";

const GlassScene = dynamic(() => import("./GlassScene"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

export default function SignaturePours() {
  const section = useRef<HTMLElement>(null);
  const glassBox = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [showGlass, setShowGlass] = useState(false);
  const drink = drinks[active];

  // Mount the 3D scene only when the section is close
  useEffect(() => {
    const el = glassBox.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShowGlass(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Colour change on the section itself
  useEffect(() => {
    if (!section.current) return;
    gsap.to(section.current, {
      backgroundColor: drink.bg,
      color: drink.fg,
      duration: prefersReducedMotion() ? 0 : 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [drink]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const n = drinks.length;
      trigger.current = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 0.7 * n}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (n - 1),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.08,
          ease: "power2.inOut",
        },
        onUpdate: (self) => {
          const i = Math.round(self.progress * (n - 1));
          setActive((prev) => (prev === i ? prev : i));
        },
      });
    },
    { scope: section },
  );

  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) {
      setActive(i);
      return;
    }
    const y = st.start + ((st.end - st.start) * i) / (drinks.length - 1);
    scrollToTarget(y);
  };

  return (
    <section
      ref={section}
      id="signature"
      aria-labelledby="signature-title"
      className="fixed-palette relative flex min-h-[100svh] items-center overflow-hidden"
      style={{ backgroundColor: drinks[0].bg, color: drinks[0].fg }}
    >
      <div className="mx-auto grid w-full max-w-site items-center gap-4 px-5 pb-10 pt-[88px] md:grid-cols-2 md:gap-10 md:px-8 md:py-0">
        <div ref={glassBox} className="order-1 h-[42svh] md:order-2 md:h-[78svh]">
          {showGlass && <GlassScene drink={drink} />}
        </div>

        <div className="order-2 md:order-1">
          <h2 id="signature-title" className="text-[15px] opacity-80">
            Signature pours
          </h2>
          <div className="relative mt-3 min-h-[200px] md:min-h-[300px]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={drink.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease }}
              >
                <p className="text-drink font-extralight tracking-[-0.02em]">{drink.name}</p>
                <p className="mt-5 max-w-[34ch] font-serif text-[clamp(22px,2.2vw,30px)] italic leading-snug opacity-90">
                  {drink.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/menu?group=coffee"
              className="on-dark inline-flex min-h-[44px] items-center rounded-full border border-current px-6 text-[16px] transition-colors hover:bg-[color-mix(in_srgb,currentColor_14%,transparent)]"
            >
              See all coffee
            </Link>
            <div className="flex items-center" role="group" aria-label="Choose a drink">
              {drinks.map((d, i) => (
                <button
                  key={d.slug}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={d.name}
                  aria-current={i === active ? "true" : undefined}
                  className="on-dark group inline-flex h-[44px] min-w-[28px] items-center justify-center"
                >
                  <span
                    className="block h-2 rounded-full bg-current transition-all duration-300"
                    style={{ width: i === active ? 32 : 8, opacity: i === active ? 1 : 0.45 }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
