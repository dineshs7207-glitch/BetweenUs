import { Monogram } from "./Monogram";

export default function Intro() {
  return (
    <section aria-labelledby="about-title" className="bg-porcelain">
      <div className="mx-auto grid max-w-site gap-10 px-5 py-24 md:grid-cols-[180px_1fr] md:gap-16 md:px-8 md:py-36">
        <Monogram className="h-[90px] text-clay md:h-[120px]" />
        <div>
          <h2
            id="about-title"
            className="max-w-[24ch] text-[clamp(30px,4.2vw,58px)] font-extralight leading-[1.12] tracking-[-0.015em] text-maroon"
          >
            A café in Kondapur for slow coffee, food from the wok and the wood fire, and the
            conversations that happen in betwēn.
          </h2>
          <p className="mt-8 max-w-[60ch] text-body text-ink/75">
            Café, Continental, Indo-Chinese and desserts, under one maroon ceiling. Come for a quick
            espresso or stay the whole evening.
          </p>
        </div>
      </div>
    </section>
  );
}
