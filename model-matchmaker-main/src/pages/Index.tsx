import { Nav } from "@/components/site/Nav";
import { HeroTile } from "@/components/site/HeroTile";
import { Tile } from "@/components/site/Tile";
import { Carousel } from "@/components/site/Carousel";
import { Footer } from "@/components/site/Footer";
import tileMigrate from "@/assets/tile-migrate.jpg";
import tileMistral from "@/assets/tile-mistral.jpg";

const Index = () => {
  return (
    <main className="bg-background">
      <Nav />
      <HeroTile />

      <Tile
        eyebrow="Detect"
        headline="Every OpenAI. Every Anthropic. Found."
        subhead="Static analysis spots SDK calls, raw HTTP, and embedded prompts across your repo."
        primaryCta="Run a scan"
        secondaryCta="See sample report"
        image={tileMigrate}
        imageAlt="Floating black API tokens with one transforming orange"
        theme="dark"
        align="center"
      />

      <Tile
        eyebrow="Powered by Mistral 7B"
        headline="Local. Private. Fast."
        subhead="Code never leaves your machine. The 7B model runs the analysis in seconds."
        primaryCta="Learn more"
        secondaryCta="Read the paper"
        image={tileMistral}
        imageAlt="Translucent capsule containing code symbols"
        theme="light"
        align="center"
      />

      <Carousel />

      <section className="grid w-full grid-cols-1 md:grid-cols-2">
        <div className="bg-foreground text-background min-h-[480px] flex flex-col items-center justify-center text-center px-8 py-20">
          <h3 className="display-headline text-[40px] md:text-[56px] max-w-[14ch]">For engineers.</h3>
          <p className="subhead mt-3 text-base md:text-lg max-w-[32ch] opacity-90">
            CLI, IDE plugin, GitHub Action. Plug it where the code lives.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="pill-solid-invert">Install CLI</button>
            <button className="pill-ghost-invert">Docs ›</button>
          </div>
        </div>
        <div className="bg-[hsl(var(--surface-light))] min-h-[480px] flex flex-col items-center justify-center text-center px-8 py-20">
          <h3 className="display-headline text-[40px] md:text-[56px] max-w-[14ch]">For platform teams.</h3>
          <p className="subhead mt-3 text-base md:text-lg max-w-[32ch] opacity-90">
            Org-wide visibility on third-party LLM spend and exposure.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="pill-solid">Talk to sales</button>
            <button className="pill-ghost">Pricing ›</button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Index;
