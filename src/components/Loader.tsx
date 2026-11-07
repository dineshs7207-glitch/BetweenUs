"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/lib/site";
import { lockScroll } from "./SmoothScroll";
import { withBase } from "@/lib/base";

const SEEN_KEY = "betwen-intro-seen";
const MAX_MS = 9000;

declare global {
  interface Window {
    __heroProgress?: number;
  }
}

/** Intro film: plays once per browser session, then the curtain lifts. */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState<"film" | "quick" | null>(null);
  const [gone, setGone] = useState(false);
  const leaving = useRef(false);
  const filmDone = useRef(false);
  const framesDone = useRef(false);

  const leave = useRef(() => {});
  leave.current = () => {
    if (leaving.current || !root.current) return;
    leaving.current = true;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const finish = () => {
      lockScroll(false);
      setGone(true);
      window.dispatchEvent(new Event("loader-done"));
    };
    if (prefersReducedMotion()) {
      gsap.to(root.current, { opacity: 0, duration: 0.3, onComplete: finish });
    } else {
      gsap.fromTo(
        root.current,
        { clipPath: "inset(0% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut", onComplete: finish },
      );
    }
  };

  useEffect(() => {
    lockScroll(true);
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    const reduced = prefersReducedMotion();
    const timers: number[] = [];

    const tryLeave = () => {
      if (filmDone.current && framesDone.current) leave.current();
    };

    const onProgress = (e: Event) => {
      const p = (e as CustomEvent<number>).detail;
      setProgress(p);
      if (p >= 1) {
        framesDone.current = true;
        tryLeave();
      }
    };
    window.addEventListener("hero-progress", onProgress);
    if (typeof window.__heroProgress === "number") {
      onProgress(new CustomEvent("hero-progress", { detail: window.__heroProgress }));
    }

    if (seen || reduced) {
      setMode("quick");
      filmDone.current = true;
      framesDone.current = true;
      timers.push(window.setTimeout(() => leave.current(), reduced ? 700 : 350));
    } else {
      setMode("film");
      timers.push(window.setTimeout(() => leave.current(), MAX_MS));
      if (!site.intro.video) {
        // Coded intro: the monogram fills like a cup, ~2.6 s
        timers.push(
          window.setTimeout(() => {
            filmDone.current = true;
            tryLeave();
          }, 2600),
        );
      }
    }

    return () => {
      window.removeEventListener("hero-progress", onProgress);
      timers.forEach(clearTimeout);
      if (!leaving.current) lockScroll(false);
    };
  }, []);

  useEffect(() => {
    if (mode === "film" && videoRef.current) {
      videoRef.current.playbackRate = 1.25;
      videoRef.current.play().catch(() => {
        filmDone.current = true;
      });
    }
  }, [mode]);

  if (gone) return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      ref={root}
      id="loader"
      className="fixed-palette on-dark fixed inset-0 z-[100] flex flex-col bg-loader-maroon text-fixed-porcelain"
      role="status"
      aria-label={`Loading ${site.name}`}
    >
      <div className="flex flex-1 items-center justify-center">
        {mode === "film" &&
          (site.intro.video ? (
            <video
              ref={videoRef}
              src={withBase(site.intro.video)}
              muted
              playsInline
              autoPlay
              preload="auto"
              onEnded={() => {
                filmDone.current = true;
                if (framesDone.current) leave.current();
              }}
              className="h-[min(70vh,70vw)] w-auto"
              aria-hidden="true"
            />
          ) : (
            <PourMark />
          ))}
      </div>
      <div className="flex items-end justify-between px-5 pb-[max(24px,env(safe-area-inset-bottom))] text-[15px] md:px-8">
        <p aria-live="off" className="tabular-nums text-fixed-porcelain/75">
          Brewing {pct}%
        </p>
        <button
          type="button"
          onClick={() => leave.current()}
          className="inline-flex min-h-[44px] items-center px-2 text-fixed-porcelain/85 underline-offset-4 hover:underline"
        >
          Skip intro
        </button>
      </div>
      <noscript>
        <style>{`#loader{display:none}`}</style>
      </noscript>
    </div>
  );
}

/** Fallback intro until logo-pour.mp4 exists: a stream pours and the monogram fills. */
function PourMark() {
  return (
    <div className="relative h-[min(46vh,46vw)] aspect-[820/1050]" aria-hidden="true">
      <span className="mask-monogram absolute inset-0 h-full text-clay/35" />
      <span
        className="mask-monogram absolute inset-0 h-full text-clay"
        style={{ animation: "pour-fill 2.2s cubic-bezier(0.65,0,0.35,1) 0.2s both" }}
      />
      <span
        className="absolute left-1/2 top-[-30vh] w-[3px] -translate-x-1/2 rounded-full bg-clay"
        style={{ animation: "pour-stream 2.2s cubic-bezier(0.65,0,0.35,1) both" }}
      />
      <style>{`
        @keyframes pour-fill { from { clip-path: inset(100% 0 0 0); } to { clip-path: inset(0 0 0 0); } }
        @keyframes pour-stream {
          0% { height: 0; opacity: 1; }
          30% { height: calc(30vh + 60%); opacity: 1; }
          80% { height: calc(30vh + 60%); opacity: 1; }
          100% { height: calc(30vh + 60%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
