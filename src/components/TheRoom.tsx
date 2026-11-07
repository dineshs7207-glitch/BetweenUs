"use client";

import { useState } from "react";
import type { Photo as PhotoT } from "@/lib/gallery";
import Photo from "./Photo";

type Strip = { photos: (PhotoT & { src: string | null })[]; direction: "left" | "right"; duration: number };

const tints = ["#F6EEE3", "#EFE6D4", "#E7EEDF", "#F3E3D0", "#E6EBD9", "#F7E3E0"];

function Row({ photos, direction, duration }: Strip) {
  const cards = (hidden: boolean) =>
    photos.map((p, i) => (
      <Photo
        key={`${hidden}-${p.file}`}
        src={p.src}
        alt={hidden ? "" : p.alt}
        label={p.label}
        tint={tints[i % tints.length]}
        sizes="(min-width: 900px) 520px, 360px"
        className="mr-4 h-[260px] w-[min(78vw,360px)] shrink-0 rounded-[22px] md:mr-5 md:h-[380px] md:w-[520px]"
      />
    ));
  return (
    <div className="marquee overflow-hidden">
      <div
        className="marquee-track"
        data-direction={direction}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <div className="flex">{cards(false)}</div>
        <div className="flex" aria-hidden="true">
          {cards(true)}
        </div>
      </div>
    </div>
  );
}

export default function TheRoom({ rowOne, rowTwo }: { rowOne: Strip["photos"]; rowTwo: Strip["photos"] }) {
  const [paused, setPaused] = useState(false);
  return (
    <section id="room" aria-labelledby="room-title" className="scroll-mt-[72px] overflow-hidden bg-porcelain py-24 md:py-36">
      <div className="mx-auto mb-12 flex max-w-site flex-col gap-6 px-5 md:mb-16 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <h2 id="room-title" className="text-section font-extralight tracking-[-0.02em] text-maroon">
            The room
          </h2>
          <p className="mt-6 max-w-[52ch] text-body text-ink/75">
            Maroon ceilings, a checkered floor, rattan lights and more plants than we can count. Pick a
            booth, the balcony or the garden terrace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex min-h-[44px] items-center self-start rounded-full border border-maroon/30 px-5 text-[15px] text-maroon hover:bg-oat motion-reduce:hidden md:self-auto"
        >
          {paused ? "Play photos" : "Pause photos"}
        </button>
      </div>
      <div className="flex flex-col gap-4 md:gap-5" data-paused={paused} >
        <div className="marquee" data-paused={paused}>
          <Row photos={rowOne} direction="left" duration={70} />
        </div>
        <div className="marquee" data-paused={paused}>
          <Row photos={rowTwo} direction="right" duration={80} />
        </div>
      </div>
    </section>
  );
}
