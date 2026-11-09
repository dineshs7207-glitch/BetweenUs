"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/lib/site";

function reportProgress(p: number) {
  window.__heroProgress = p;
  window.dispatchEvent(new CustomEvent("hero-progress", { detail: p }));
}

/**
 * Hero: a Higgsfield film on cream (Kling 3.0 between two GPT Image keyframes).
 * The giant BETWĒN US wordmark is part of the film; beans swirl down into the
 * BB cup and become a latte as you scroll. The film is scrubbed by scroll
 * (scroll-world technique: lerp toward the target, never seek while seeking).
 */
export default function HeroSwirl({ src, poster }: { src: string; poster: string }) {
  const section = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useRef({ p: 0 });

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let cancelled = false;
    let objectUrl: string | null = null;
    let raf = 0;
    let cur = 0;
    reportProgress(0);

    (async () => {
      try {
        const res = await fetch(src);
        if (!res.ok || !res.body) throw new Error(String(res.status));
        const total = Number(res.headers.get("content-length")) || 0;
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let got = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          got += value.length;
          if (total) reportProgress(Math.min(0.99, got / total));
        }
        if (cancelled) return;
        objectUrl = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: "video/mp4" }));
        v.src = objectUrl;
      } catch {
        if (cancelled) return;
        v.src = src;
      }
      v.load();
      reportProgress(1);
    })();

    v.addEventListener("loadeddata", () => {
      try { v.pause(); } catch {}
      if (prefersReducedMotion()) v.currentTime = Math.max(0, v.duration - 0.05);
    }, { once: true });

    // iOS only decodes seeks after a play() inside a gesture
    const prime = () => {
      try {
        const pr = v.play();
        if (pr && pr.then) pr.then(() => v.pause()).catch(() => {});
      } catch {}
    };
    window.addEventListener("touchstart", prime, { once: true, passive: true });

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!v.duration || v.seeking || v.readyState < 1 || prefersReducedMotion()) return;
      cur += (progress.current.p - cur) * 0.14;
      const t = Math.min(cur, 0.995) * v.duration;
      if (Math.abs(v.currentTime - t) > 0.012) {
        try { v.currentTime = t; } catch {}
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("touchstart", prime);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(section);
      if (prefersReducedMotion()) {
        gsap.set(q("[data-tag]"), { autoAlpha: 1, y: 0 });
        gsap.set(q("[data-cue]"), { autoAlpha: 0 });
        return;
      }
      gsap.set(q("[data-tag]"), { autoAlpha: 0, y: 28 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=170%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to(progress.current, { p: 1, duration: 0.86 }, 0)
                .to(q("[data-cue]"), { autoAlpha: 0, duration: 0.08 }, 0.02)
        .to(q("[data-tag]"), { autoAlpha: 1, y: 0, duration: 0.12, stagger: 0.06, ease: "power2.out" }, 0.74)
        .to({}, { duration: 0.1 });

      const onDone = () => ScrollTrigger.refresh();
      window.addEventListener("loader-done", onDone);
      return () => window.removeEventListener("loader-done", onDone);
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      className="fixed-palette relative h-[100svh] min-h-[520px] overflow-hidden bg-[#EFD6C2]"
      aria-labelledby="hero-title"
    >
      <h1 id="hero-title" className="sr-only">
        {site.name}, a café in {site.area}. {site.tagline}
      </h1>

      <div data-film className="absolute inset-0 flex items-center justify-center will-change-transform">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          poster={poster}
          aria-hidden="true"
          tabIndex={-1}
          className="h-auto w-full max-w-none object-contain md:h-full md:object-cover"
        />
      </div>

      {/* Soft edges so the film melts into the page */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#EFD6C2] to-transparent" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-5 pb-[max(40px,calc(env(safe-area-inset-bottom)+24px))] md:px-8 md:pb-14"
      >
        <div className="mx-auto max-w-site text-[clamp(26px,3.4vw,48px)] leading-[1.08] text-maroon">
          <p data-tag className="font-extralight tracking-[-0.01em]">For pauses</p>
          <p data-tag className="font-serif italic">and conversations in betwēn.</p>
        </div>
      </div>

      <p data-cue className="absolute inset-x-0 bottom-[max(20px,env(safe-area-inset-bottom))] z-10 text-center text-[14px] text-ink/60">
        Scroll to pour
      </p>
    </section>
  );
}
