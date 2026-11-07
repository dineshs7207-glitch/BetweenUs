import { site } from "@/lib/site";

type Props = { className?: string; style?: React.CSSProperties; title?: string };

/** The BB monogram, as a CSS mask so it takes the current text colour. */
export function Monogram({ className = "", style, title }: Props) {
  return (
    <span
      className={`mask-monogram ${className}`}
      style={style}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    />
  );
}

/**
 * The "Betwēn us" wordmark. Set in Outfit extralight with wide tracking to
 * match the logo. Swap for the cut PNG mask (2416:394) once wordmark.png is
 * in /public/brand.
 */
export function Wordmark({ className = "", style }: Props) {
  return (
    <span
      className={`inline-block whitespace-nowrap font-sans font-light leading-none tracking-[0.12em] ${className}`}
      style={style}
    >
      Betwēn us
      <span className="sr-only"> ({site.area})</span>
    </span>
  );
}
