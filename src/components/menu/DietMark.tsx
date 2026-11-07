/** Indian veg / non-veg square marks, as printed on the café's dessert menu. */
export default function DietMark({ diet }: { diet?: "veg" | "nonveg" }) {
  if (!diet) return null;
  const veg = diet === "veg";
  const color = veg ? "#2F7D3A" : "#B3261E";
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-ink/65">
      <span
        aria-hidden="true"
        className="inline-flex h-[13px] w-[13px] items-center justify-center rounded-[2px] border-[1.5px] bg-white"
        style={{ borderColor: color }}
      >
        <span className="h-[6px] w-[6px] rounded-full" style={{ backgroundColor: color }} />
      </span>
      {veg ? "Veg" : "Non-veg"}
    </span>
  );
}
