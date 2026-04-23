import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import c1 from "@/assets/carousel-1.jpg";
import c2 from "@/assets/carousel-2.jpg";
import c3 from "@/assets/carousel-3.jpg";

const slides = [
  {
    img: c1,
    eyebrow: "Catalog",
    title: "12,000+ Hugging Face models, ranked.",
    sub: "We match each API call to the smallest model that does the job.",
  },
  {
    img: c2,
    eyebrow: "Workflow",
    title: "From scan to PR in minutes.",
    sub: "Auto-generate diff suggestions for every detected call site.",
  },
  {
    img: c3,
    eyebrow: "Independence",
    title: "Cut the cord from closed APIs.",
    sub: "Bring inference in-house. Own your stack, end to end.",
  },
];

export const Carousel = () => {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [playing]);

  const s = slides[i];

  return (
    <section className="w-full bg-[hsl(var(--surface-light))]">
      <div className="relative w-full h-[520px] md:h-[640px] overflow-hidden">
        {slides.map((slide, idx) => (
          <img
            key={idx}
            src={slide.img}
            alt=""
            width={1920}
            height={1080}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-end px-6 pb-16 text-background">
          <p className="subhead text-xs uppercase tracking-[0.2em] mb-3 opacity-80">{s.eyebrow}</p>
          <h3 className="display-headline text-[36px] md:text-[60px] max-w-[16ch]">{s.title}</h3>
          <p className="subhead mt-3 text-base md:text-lg opacity-90 max-w-[40ch]">{s.sub}</p>
          <div className="mt-6 flex gap-3">
            <button className="pill-solid-invert">Explore models</button>
            <button className="pill-ghost-invert">Read brief ›</button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1200px] items-center justify-center gap-3 py-5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === i ? "w-8 bg-foreground" : "w-1.5 bg-foreground/30"
            }`}
          />
        ))}
        <button
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((p) => !p)}
          className="ml-3 grid h-6 w-6 place-items-center rounded-full border border-foreground/40 hover:border-foreground transition"
        >
          {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </button>
      </div>
    </section>
  );
};
