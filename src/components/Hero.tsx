"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/lib/site";
import { drawPour } from "@/lib/pour";

const { frameCount, framePath, frameExt, focusY } = site.hero;
const frameSrc = (i: number) => `${framePath}${String(i + 1).padStart(4, "0")}.${frameExt}`;

function reportProgress(p: number) {
  window.__heroProgress = p;
  window.dispatchEvent(new CustomEvent("hero-progress", { detail: p }));
}

/** "Betwēn [arch] us": the coffee literally sits between the two words. */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<HTMLImageElement[]>([]);
  const progress = useRef({ p: 0 });
  const lastDrawn = useRef(-1);

  const draw = useRef((force = false) => {});
  draw.current = (force = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = progress.current.p;

    if (frameCount > 0) {
      const idx = Math.round(p * (frameCount - 1));
      if (!force && idx === lastDrawn.current) return;
      // Fall back to the nearest loaded frame
      let img: HTMLImageElement | undefined;
      for (let d = 0; d < frameCount; d++) {
        const a = frames.current[idx - d];
        const b = frames.current[idx + d];
        if (a?.complete && a.naturalWidth) { img = a; break; }
        if (b?.complete && b.naturalWidth) { img = b; break; }
      }
      if (!img) return;
      lastDrawn.current = idx;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) * focusY, dw, dh);
    } else {
      const q = Math.round(p * 400);
      if (!force && q === lastDrawn.current) return;
      lastDrawn.current = q;
      drawPour(ctx, canvas.width, canvas.height, q / 400);
    }
  };

  // Size the canvas to the viewport (DPR capped at 2)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      draw.current(true);
    };
    resize();
    let w = window.innerWidth;
    const onResize = () => {
      // Ignore height-only changes from the phone address bar
      if (window.innerWidth === w && Math.abs(window.innerHeight - canvas.height / Math.min(window.devicePixelRatio || 1, 2)) < 140) return;
      w = window.innerWidth;
      resize();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Preload frames, report progress to the loader
  useEffect(() => {
    if (frameCount === 0) {
      reportProgress(1);
      return;
    }
    let loaded = 0;
    const done = () => {
      loaded++;
      reportProgress(loaded / frameCount);
      if (loaded === 1 || loaded === frameCount) draw.current(true);
    };
    frames.current = Array.from({ length: frameCount }, (_, i) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = done;
      img.onerror = done;
      img.src = frameSrc(i);
      return img;
    });
    reportProgress(0);
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      const arch = q("[data-arch]")[0] as HTMLElement;
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set(arch, { width: "100vw", height: "100svh", borderRadius: 0 });
        gsap.set(q("[data-word]"), { autoAlpha: 0 });
        gsap.set(q("[data-shade], [data-tag]"), { autoAlpha: 1, y: 0 });
        gsap.set(q("[data-cue]"), { autoAlpha: 0 });
        progress.current.p = 1;
        draw.current(true);
        return;
      }

      gsap.set(q("[data-tag]"), { autoAlpha: 0, y: 40 });
      gsap.set(q("[data-shade]"), { autoAlpha: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=260%",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(progress.current, { p: 1, duration: 1, onUpdate: () => draw.current() }, 0)
        .to(q("[data-word='left']"), { xPercent: -120, autoAlpha: 0, duration: 0.45 }, 0.05)
        .to(q("[data-word='right']"), { xPercent: 120, autoAlpha: 0, duration: 0.45 }, 0.05)
        .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.1 }, 0.02)
        .to(
          arch,
          {
            width: () => window.innerWidth,
            height: () => window.innerHeight,
            borderRadius: 0,
            ease: "power2.inOut",
            duration: 0.5,
          },
          0.12,
        )
        .to(q("[data-shade]"), { autoAlpha: 1, duration: 0.15 }, 0.55)
        .to(q("[data-tag]"), { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.08, ease: "power2.out" }, 0.62);

      // Refresh once the loader has gone so pin spacing is measured correctly
      const onDone = () => ScrollTrigger.refresh();
      window.addEventListener("loader-done", onDone);
      return () => window.removeEventListener("loader-done", onDone);
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="relative h-[100svh] min-h-[520px] overflow-hidden bg-porcelain"
      aria-labelledby="hero-title"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name}, a café in {site.area}. {site.tagline}
      </h1>

      {/* The arch window onto the coffee */}
      <div
        data-arch
        className="absolute left-1/2 top-1/2 z-0 h-[clamp(230px,46svh,560px)] w-[clamp(150px,44vw,340px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-maroon-deep sm:h-[clamp(230px,58svh,560px)] sm:w-[clamp(150px,22vw,340px)]"
        style={{ borderRadius: "999px 999px 28px 28px" }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[100vh] w-[100vw] -translate-x-1/2 -translate-y-1/2"
        />
        <div
          data-shade
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#1A0906]/80 via-[#1A0906]/35 to-transparent"
        />
      </div>

      {/* Tagline rises in once the arch fills the screen */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(56px,calc(env(safe-area-inset-bottom)+32px))] md:px-8 md:pb-20"
        aria-hidden="true"
      >
        <div className="mx-auto max-w-site text-tagline text-[#FFFDF9]">
          <p data-tag className="font-extralight tracking-[-0.01em]">
            For pauses
          </p>
          <p data-tag className="font-serif italic">
            and conversations in betwēn.
          </p>
        </div>
      </div>

      {/* Betwēn | arch | us: a 3-column grid keeps the arch exactly centred */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 grid grid-rows-[1fr_clamp(230px,46svh,560px)_1fr] items-center justify-items-center sm:grid-cols-[1fr_clamp(150px,22vw,340px)_1fr] sm:grid-rows-1 sm:gap-x-[clamp(16px,2.5vw,44px)]"
      >
        <span
          data-word="left"
          className="self-end pb-2 text-hero sm:text-[clamp(40px,9.6vw,220px)] font-extralight tracking-[0.04em] text-maroon sm:self-auto sm:justify-self-end sm:pb-0"
        >
          Betwēn
        </span>
        <span className="sm:col-start-2" />
        <span
          data-word="right"
          className="self-start text-hero sm:text-[clamp(40px,9.6vw,220px)] font-extralight tracking-[0.04em] text-maroon sm:self-auto sm:justify-self-start"
        >
          us
        </span>
      </div>

      <p
        data-cue
        className="absolute inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] z-10 text-center text-[14px] text-ink/60"
      >
        Scroll to pour
      </p>
    </section>
  );
}
