import Link from "next/link";
import Film from "@/components/Film";
import Reveal from "@/components/Reveal";
import { HERO_WORLDS } from "@/lib/campaign";

/**
 * World story — the story panel of the live theme's amd-world-experience
 * section: the Water campaign film in a 4:5 frame beside the brand story
 * (the film's product, Roses Boxy Tank, is the section CTA target).
 * Copy is the live store's own story text, verbatim.
 */
export default function WorldStory() {
  const water = HERO_WORLDS[0];
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
      <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Film
              src={water.film}
              poster={water.poster}
              label="Our story"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            Our story
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-bone md:text-6xl">
            The anchor does not mean <span className="text-brass">stand still.</span>
          </h2>
          <blockquote className="mt-6 font-display text-2xl uppercase tracking-wide text-bone">
            It means hold.
          </blockquote>
          <p className="mt-5 max-w-md text-base leading-7 text-ash">
            Anchor Me Down was built on a simple belief: your clothes should
            work as hard as you do. The anchor is steadiness through
            motion—the strength to hold your ground while everything around
            you changes.
          </p>
          <Link
            href={`/products/${water.productHandle}`}
            className="mt-8 inline-block border border-bone/30 px-9 py-4 font-display text-base uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
          >
            Shop the look ↗
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
