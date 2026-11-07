import Link from "next/link";
import { site } from "@/lib/site";
import { Monogram, Wordmark } from "./Monogram";

export default function Footer() {
  return (
    <footer className="fixed-palette on-dark bg-fixed-maroon text-fixed-porcelain">
      <div className="mx-auto max-w-site px-5 pb-[max(40px,env(safe-area-inset-bottom))] pt-16 md:px-8 md:pt-24">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <Monogram className="h-16 text-clay" />
              <Wordmark className="text-[26px]" />
            </div>
            <p className="mt-6 max-w-[22ch] font-serif text-[28px] italic leading-tight text-fixed-porcelain/90">
              {site.tagline}
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-2 gap-y-1 text-[17px]">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/#lounge", label: "Private lounge" },
                { href: "/#visit", label: "Visit" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-[44px] items-center px-3 hover:text-clay">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.instagramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center px-3 hover:text-clay"
                >
                  Instagram<span className="sr-only"> {site.instagram}, opens in a new tab</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-fixed-porcelain/15 pt-6 text-[15px] text-clay sm:flex-row sm:justify-between">
          <p>© 2026 Betwēn Us, {site.area}</p>
          <p>
            <a href={site.phoneHref} className="inline-flex min-h-[44px] items-center hover:text-fixed-porcelain">
              {site.phone}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
