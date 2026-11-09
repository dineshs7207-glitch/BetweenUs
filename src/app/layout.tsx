import type { Metadata, Viewport } from "next";
import { Outfit, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { withBase } from "@/lib/base";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-outfit",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dineshs7207-glitch.github.io/BetweenUs/"),
  title: {
    default: `${site.name}, café in ${site.area}`,
    template: `%s · ${site.name}`,
  },
  description: `${site.tagline} Slow coffee, food from the wok and the wood fire, and desserts in ${site.area}.`,
  openGraph: {
    title: site.name,
    description: site.tagline,
    siteName: site.name,
    locale: "en_IN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.tagline },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFFDF9",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: site.name,
  slogan: site.tagline,
  servesCuisine: ["Café", "Continental", "Indo-Chinese", "Desserts"],
  telephone: "+918096334448",
  address: { "@type": "PostalAddress", addressLocality: "Kondapur, Hyderabad", addressCountry: "IN" },
  sameAs: [site.instagramHref],
  hasMap: site.mapsHref,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${serif.variable}`}>
      <body
        className="font-sans"
        style={{ ["--monogram-url" as string]: `url("${withBase("/brand/monogram.png")}")` }}
      >
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
