"use client";

import Image from "next/image";
import { useState } from "react";
import { groupTint, type MenuItem } from "@/lib/menu";
import { Monogram } from "../Monogram";
import { withBase } from "@/lib/base";

type Props = {
  item: MenuItem;
  /** Slugs that have a file in /public/menu (checked at build time) */
  available: Set<string>;
  sizes: string;
  className?: string;
  imgClassName?: string;
};

export const dishSrc = (item: MenuItem, available: Set<string>) =>
  (item.img ? withBase(item.img) : null) ??
  (available.has(item.slug) ? withBase(`/menu/${item.slug}.webp`) : null);

export default function DishImage({ item, available, sizes, className = "", imgClassName = "" }: Props) {
  const src = dishSrc(item, available);
  const [failed, setFailed] = useState(false);
  const tint = groupTint[item.group].tile;

  return (
    <div className={`fixed-palette relative overflow-hidden ${className}`} style={{ backgroundColor: tint }}>
      {src && !failed ? (
        <Image
          src={src}
          alt={item.name}
          fill
          sizes={sizes}
          className={`object-cover ${imgClassName}`}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-fixed-maroon" role="img" aria-label={`${item.name}, photo coming soon`}>
          <Monogram className="h-[34%] opacity-[0.13]" />
          <span className="text-[14px] text-fixed-maroon/55">Photo coming soon</span>
        </div>
      )}
    </div>
  );
}
