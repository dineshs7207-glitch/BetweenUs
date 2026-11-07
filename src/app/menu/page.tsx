import type { Metadata } from "next";
import { Suspense } from "react";
import MenuBrowser from "@/components/menu/MenuBrowser";
import { listPublic } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Coffee, cold brews, Indo-Chinese bowls, pasta, sandwiches and desserts at Betwēn Us, Kondapur. Tap any dish for details and to order on Swiggy or Zomato.",
};

export default function MenuPage() {
  const availableSlugs = listPublic("menu").map((f) => f.replace(/\.[a-z]+$/i, ""));
  return (
    <main id="main">
      <Suspense fallback={<div className="min-h-[100svh]" />}>
        <MenuBrowser availableSlugs={availableSlugs} />
      </Suspense>
    </main>
  );
}
