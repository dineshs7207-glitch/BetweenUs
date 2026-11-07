import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import SignaturePours from "@/components/SignaturePours";
import FieldNotes, { type FieldNote } from "@/components/FieldNotes";
import NewSignatures from "@/components/NewSignatures";
import TheRoom from "@/components/TheRoom";
import Lounge from "@/components/Lounge";
import Visit from "@/components/Visit";
import { listPublic } from "@/lib/assets";
import { withBase } from "@/lib/base";
import { loungePhoto, roomRowOne, roomRowTwo, visitPhoto } from "@/lib/gallery";

export default function Home() {
  const gallery = new Set(listPublic("gallery"));
  const dishes = new Set(listPublic("dishes"));
  const g = (file: string) => (gallery.has(file) ? withBase(`/gallery/${file}`) : null);
  const d = (slug: string) => (dishes.has(`${slug}.webp`) ? withBase(`/dishes/${slug}.webp`) : null);

  const notes: FieldNote[] = [
    {
      slug: "bharwan-paneer-tikka",
      name: "Bharwan Paneer Tikka",
      no: 11,
      bg: "#F6E8D6",
      effects: ["Table-wide attention", "Reduced conversation", "Rapid plate depletion"],
      src: d("bharwan-paneer-tikka"),
      alt: "Bharwan paneer tikka, stuffed paneer cubes charred from the tandoor",
    },
    {
      slug: "kung-pao-rice-bowl",
      name: "Kung Pao Rice Bowl",
      no: 19,
      bg: "#F3E3D0",
      effects: ["Increased fork activity", "Heightened anticipation", "Accelerated consumption"],
      src: d("kung-pao-rice-bowl"),
      alt: "Kung pao rice bowl in a stoneware bowl",
    },
    {
      slug: "achari-caesar-salad",
      name: "Achari Caesar Salad",
      bg: "#EFE6D4",
      note: "Our Caesar, reinvented with an Indian twist. With chicken.",
      src: d("achari-caesar-salad"),
      alt: "Achari Caesar salad with grilled chicken, shaved cheese, croutons, parsley and a purple edible flower in a grey stoneware bowl",
    },
    {
      slug: "spinach-green-chilli-pasta",
      name: "Spinach & Green Chilli Pasta",
      bg: "#E6EBD9",
      src: d("spinach-green-chilli-pasta"),
      alt: "Spinach and green chilli pasta in a creamy green sauce",
    },
    {
      // TODO: confirm Summer Madness is still on the menu
      slug: "summer-mango-desserts",
      name: "Summer Madness",
      note: "Mangomisu, mango mousse and mango tart.",
      bg: "#F7E7C8",
      src: d("summer-mango-desserts"),
      alt: "Three mango desserts: mangomisu, mango mousse and mango tart",
    },
  ];

  const row = (photos: typeof roomRowOne) => photos.map((p) => ({ ...p, src: g(p.file) }));

  return (
    <>
      <Loader />
      <main id="main">
        <Hero />
        <Intro />
        <SignaturePours />
        <FieldNotes notes={notes} />
        <NewSignatures src={g("ube-collection.webp")} />
        <TheRoom rowOne={row(roomRowOne)} rowTwo={row(roomRowTwo)} />
        <Lounge src={g(loungePhoto.file)} />
        <Visit src={g(visitPhoto.file)} />
      </main>
    </>
  );
}
