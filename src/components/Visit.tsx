import { site } from "@/lib/site";
import { visitPhoto } from "@/lib/gallery";
import OrderButtons from "./OrderButtons";
import Photo from "./Photo";

export default function Visit({ src }: { src: string | null }) {
  const row = "grid gap-1 border-t border-maroon/15 py-5 sm:grid-cols-[120px_1fr] sm:gap-6";
  const link = "inline-flex min-h-[44px] items-center text-maroon underline decoration-maroon/30 underline-offset-4 hover:decoration-maroon";
  return (
    <section id="visit" aria-labelledby="visit-title" className="scroll-mt-[72px] bg-porcelain">
      <div className="mx-auto grid max-w-site gap-14 px-5 py-24 md:grid-cols-2 md:gap-20 md:px-8 md:py-36">
        <div>
          <h2 id="visit-title" className="text-section font-extralight tracking-[-0.02em] text-maroon">
            Come over
          </h2>
          <dl className="mt-10 text-body">
            <div className={row}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">Where</dt>
              <dd>
                <p className="pt-[8px]">{site.address ?? site.area}</p>
                <a href={site.mapsHref} target="_blank" rel="noopener noreferrer" className={link}>
                  Get directions<span className="sr-only"> in Google Maps, opens in a new tab</span>
                </a>
              </dd>
            </div>
            <div className={row}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">When</dt>
              {/* TODO: opening hours from the café */}
              <dd className="pt-[8px]">{site.hours ?? "Opening hours coming soon. Call us to check."}</dd>
            </div>
            <div className={row}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">Call</dt>
              <dd>
                <a href={site.phoneHref} className={`${link} text-[22px] font-light`}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div className={`${row} border-b`}>
              <dt className="text-[15px] text-ink/60 sm:pt-[10px]">Follow</dt>
              <dd>
                <a href={site.instagramHref} target="_blank" rel="noopener noreferrer" className={link}>
                  {site.instagram}
                  <span className="sr-only"> on Instagram, opens in a new tab</span>
                </a>
              </dd>
            </div>
          </dl>

          <h3 className="mt-14 text-[clamp(26px,2.6vw,36px)] font-extralight text-maroon">Rather eat at home?</h3>
          <OrderButtons className="mt-6" />
        </div>

        <a
          href={site.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block self-start overflow-hidden rounded-[28px]"
        >
          <Photo
            src={src}
            alt={visitPhoto.alt}
            label={site.area}
            tint="#F3E3D0"
            sizes="(min-width: 900px) 600px, 92vw"
            className="aspect-[4/5] transition-transform duration-700 ease-soft group-hover:scale-[1.02]"
          />
          <span className="fixed-palette absolute bottom-5 left-5 inline-flex min-h-[44px] items-center rounded-full bg-fixed-porcelain px-5 text-[16px] text-fixed-maroon shadow-md">
            Open in Google Maps<span className="sr-only">, opens in a new tab</span>
          </span>
        </a>
      </div>
    </section>
  );
}
