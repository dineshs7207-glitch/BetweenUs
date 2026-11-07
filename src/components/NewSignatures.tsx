import Photo from "./Photo";

/** The café's Ube collection poster ("The Purple Dream"). */
export default function NewSignatures({ src }: { src: string | null }) {
  return (
    <section aria-labelledby="ube-title" className="bg-porcelain">
      <div className="mx-auto grid max-w-site items-center gap-10 px-5 py-20 md:grid-cols-[1.15fr_1fr] md:gap-16 md:px-8 md:py-32">
        <Photo
          src={src}
          alt="Four layered ube drinks in ribbed glasses, purple yam over milk, topped with coconut, matcha and edible flowers, on a lilac background"
          label="Ube collection"
          tint="#E6DDF1"
          sizes="(min-width: 900px) 640px, 92vw"
          className="aspect-[1280/910] rounded-[28px]"
        />
        <div>
          <p className="text-[15px] text-ink/60">New signatures</p>
          <h2 id="ube-title" className="mt-3 text-section font-extralight tracking-[-0.02em] text-maroon">
            The ube collection
          </h2>
          <p className="mt-6 max-w-[34ch] font-serif text-[clamp(22px,2.2vw,30px)] italic leading-snug text-ink/85">
            An ode to the humble purple yam, crafted into silky lattes and indulgent drinks that blur
            the line betwēn comfort and luxury.
          </p>
          <p className="mt-6 text-body text-ink/75">Creamy, earthy, vibrant.</p>
        </div>
      </div>
    </section>
  );
}
