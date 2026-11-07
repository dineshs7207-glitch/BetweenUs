import { site } from "@/lib/site";
import { loungePhoto } from "@/lib/gallery";
import Photo from "./Photo";

export default function Lounge({ src }: { src: string | null }) {
  return (
    <section
      id="lounge"
      aria-labelledby="lounge-title"
      className="fixed-palette on-dark scroll-mt-[72px] bg-maroon-deep text-fixed-porcelain"
    >
      <div className="mx-auto grid max-w-site items-center gap-12 px-5 py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20 md:px-8 md:py-36">
        <Photo
          src={src}
          alt={loungePhoto.alt}
          label={loungePhoto.label}
          tint="#5A1A14"
          sizes="(min-width: 900px) 480px, 80vw"
          className="mx-auto aspect-[4/5] w-full max-w-[480px] rounded-[999px_999px_26px_26px] [&_span]:text-fixed-porcelain"
        />
        <div>
          <h2 id="lounge-title" className="text-section font-extralight tracking-[-0.02em]">
            The private lounge
          </h2>
          <p className="mt-6 max-w-[46ch] text-body text-fixed-porcelain/80">
            A separate room with deep sofas and its own screen, for birthdays, team evenings and small
            celebrations. Tell us the date and the headcount and we will plan the food and drinks with
            you.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={site.phoneHref}
              className="inline-flex min-h-[52px] items-center rounded-full bg-fixed-porcelain px-7 text-[17px] text-fixed-maroon transition-colors hover:bg-oat"
            >
              Call {site.phone}
            </a>
            <a
              href={site.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center rounded-full border border-fixed-porcelain/60 px-7 text-[17px] transition-colors hover:bg-fixed-porcelain/10"
            >
              Message us on Instagram<span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
