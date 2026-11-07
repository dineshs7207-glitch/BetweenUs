import { site } from "@/lib/site";

type Props = {
  variant?: "solid" | "outline";
  className?: string;
  size?: "md" | "lg";
  /** Extra screen-reader context, e.g. the dish name */
  context?: string;
};

export const pill =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 text-[16px] font-normal transition-colors duration-200";

export default function OrderButtons({ variant = "solid", className = "", size = "md", context }: Props) {
  const base = `${pill} ${size === "lg" ? "min-h-[52px] px-7 text-[17px]" : ""}`;
  const style =
    variant === "solid"
      ? "bg-maroon text-on-maroon hover:bg-maroon-deep dark:hover:opacity-90"
      : "border border-current hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)]";
  const extra = context ? ` (${context})` : "";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={site.order.swiggy} target="_blank" rel="noopener noreferrer" className={`${base} ${style}`}>
        Order on Swiggy<span className="sr-only">{extra}, opens in a new tab</span>
      </a>
      <a href={site.order.zomato} target="_blank" rel="noopener noreferrer" className={`${base} ${style}`}>
        Order on Zomato<span className="sr-only">{extra}, opens in a new tab</span>
      </a>
    </div>
  );
}
