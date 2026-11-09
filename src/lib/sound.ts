"use client";

import { withBase } from "./base";

/**
 * Tiny Web Audio sound layer. Off by default (browsers need a tap before audio),
 * remembered per visitor. Two kinds of sound:
 *  - scrub loops: a looping sample whose volume follows scroll speed, so beans
 *    rattle only while you scroll the hero and fall silent when you stop;
 *  - one-shots: a short sample (ice clink, cup set down) on a moment.
 * Files come from Higgsfield (Mirelo SFX) via `npm run photos` → public/audio.
 */

export type SoundName = "beans" | "pour" | "ice" | "grind" | "cup";

const KEY = "betwen-sound";
const MASTER = 0.55;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
const buffers = new Map<SoundName, AudioBuffer>();
const loading = new Map<SoundName, Promise<AudioBuffer | null>>();
const listeners = new Set<(on: boolean) => void>();

function load(name: SoundName) {
  if (!ctx) return Promise.resolve(null);
  if (!loading.has(name)) {
    const c = ctx;
    loading.set(
      name,
      fetch(withBase(`/audio/${name}.mp3`))
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
        .then((b) => c.decodeAudioData(b))
        .then((buf) => {
          buffers.set(name, buf);
          return buf;
        })
        .catch(() => null),
    );
  }
  return loading.get(name)!;
}

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = MASTER;
  master.connect(ctx.destination);
  (["beans", "pour", "ice", "grind", "cup"] as SoundName[]).forEach(load);
  return ctx;
}

export function soundEnabled() {
  return enabled;
}

export function setSound(on: boolean) {
  enabled = on;
  try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {}
  if (on) {
    const c = ensure();
    c?.resume().catch(() => {});
  } else {
    ctx?.suspend().catch(() => {});
  }
  listeners.forEach((f) => f(on));
}

export function onSoundChange(f: (on: boolean) => void) {
  listeners.add(f);
  return () => listeners.delete(f);
}

/** Restore the visitor's choice; audio resumes on their first tap or key. */
export function restoreSound() {
  let saved = false;
  try { saved = localStorage.getItem(KEY) === "1"; } catch {}
  if (!saved) return;
  enabled = true;
  listeners.forEach((f) => f(true));
  const wake = () => {
    if (!enabled) return;
    ensure()?.resume().catch(() => {});
  };
  window.addEventListener("pointerdown", wake, { once: true, passive: true });
  window.addEventListener("keydown", wake, { once: true });
}

export function playOnce(name: SoundName, volume = 0.6, rate = 1) {
  if (!enabled || !ctx || !master || ctx.state !== "running") return;
  const buf = buffers.get(name);
  if (!buf) return;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = rate * (0.96 + Math.random() * 0.08);
  const g = ctx.createGain();
  g.gain.value = volume;
  src.connect(g).connect(master);
  src.start();
}

/**
 * A looping sample whose loudness follows scroll speed. Call `feed(progress)`
 * from a scroll update; it measures speed itself and eases the volume.
 */
export function scrubLoop(name: SoundName, maxVolume = 0.7) {
  let src: AudioBufferSourceNode | null = null;
  let gain: GainNode | null = null;
  let last = 0;
  let lastT = 0;
  let idle = 0;

  const start = () => {
    if (src || !ctx || !master) return;
    const buf = buffers.get(name);
    if (!buf) return;
    src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(gain).connect(master);
    src.start(0, Math.random() * buf.duration);
  };

  const stop = () => {
    if (!src || !gain || !ctx) return;
    const s = src;
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    window.setTimeout(() => { try { s.stop(); } catch {} }, 400);
    src = null;
    gain = null;
  };

  return {
    /** progress: 0..1 inside the scene; active: whether this sound belongs here */
    feed(progress: number, active = true) {
      if (!enabled || !ctx || ctx.state !== "running") return;
      const now = performance.now();
      const dt = Math.max(16, now - lastT);
      const speed = Math.abs(progress - last) / dt; // progress per ms
      last = progress;
      lastT = now;
      if (!active) { stop(); return; }
      start();
      if (!gain) return;
      const level = Math.min(1, speed * 900) * maxVolume;
      gain.gain.setTargetAtTime(level, ctx.currentTime, level > 0.01 ? 0.06 : 0.25);
      window.clearTimeout(idle);
      idle = window.setTimeout(() => gain && ctx && gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2), 140);
    },
    stop,
  };
}
