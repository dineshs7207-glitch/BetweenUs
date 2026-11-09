"use client";

import { useEffect, useState } from "react";
import { onSoundChange, restoreSound, setSound, soundEnabled } from "@/lib/sound";

/** Small floating sound switch. Off by default; the choice is remembered. */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const off = onSoundChange(setOn);
    restoreSound();
    setOn(soundEnabled());
    return () => {
      off();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-4 z-[60] inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-maroon/20 bg-[#FFFDF9]/80 px-4 text-[14px] text-maroon shadow-[0_6px_24px_rgba(61,16,12,0.12)] backdrop-blur-md transition-colors hover:bg-[#FFFDF9] md:left-6"
    >
      <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-maroon"
            style={{
              height: on ? "100%" : "25%",
              animation: on ? `snd-bar 0.9s ease-in-out ${i * 0.15}s infinite alternate` : "none",
              transition: "height .3s",
            }}
          />
        ))}
      </span>
      {on ? "Sound on" : "Sound off"}
      <style>{`@keyframes snd-bar { from { transform: scaleY(.3); } to { transform: scaleY(1); } } [aria-pressed] span span { transform-origin: bottom; }`}</style>
    </button>
  );
}
