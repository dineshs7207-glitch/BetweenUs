import Image from "next/image";
import { Monogram } from "./Monogram";

type Props = {
  /** null when the file is not in /public yet: shows a branded tile instead */
  src: string | null;
  alt: string;
  label?: string;
  tint?: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/** A photo that degrades to a tinted, branded tile when the real image is missing. */
export default function Photo({ src, alt, label, tint = "#F6EEE3", sizes, className = "", imgClassName = "", priority }: Props) {
  return (
    <div className={`fixed-palette relative overflow-hidden ${className}`} style={{ backgroundColor: tint }}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-fixed-maroon" role="img" aria-label={alt}>
          <Monogram className="h-[38%] max-h-[120px] opacity-[0.12]" />
          {label && <span className="px-4 text-center font-serif text-[20px] italic opacity-70">{label}</span>}
        </div>
      )}
    </div>
  );
}
