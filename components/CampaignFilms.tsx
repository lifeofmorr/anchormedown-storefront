import Link from "next/link";
import Film from "@/components/Film";
import Reveal from "@/components/Reveal";
import { HERO_WORLDS } from "@/lib/campaign";

/**
 * Campaign films — the live theme's amd-campaign-films section:
 * the two world films as full-bleed panels with their live copy,
 * posters and product links (Water → Roses Boxy Tank, Iron → Snow Wash Lite).
 */
const PANELS = [
  {
    world: HERO_WORLDS[0],
    kicker: "Film 01 · The water",
    heading: (
      <>
        Full throttle. <span className="text-brass">Still anchored.</span>
      </>
    ),
    body: "Premium weight for marina mornings, boat days, and every dockside hour after.",
    cta: "Shop the water",
  },
  {
    world: HERO_WORLDS[1],
    kicker: "Film 02 · The iron",
    heading: (
      <>
        Made to move. <span className="text-brass">Built to hold.</span>
      </>
    ),
    body: "Structured silhouettes that carry the work from the rack to the street.",
    cta: "Shop the iron",
  },
];

export default function CampaignFilms() {
  return (
    <section className="bg-coal">
      <div className="mx-auto max-w-[1440px] px-5 pb-20 pt-28 md:px-10">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            02 · Two worlds · One uniform
          </p>
          <h2 className="mt-4 max-w-4xl font-display text-6xl uppercase leading-[0.9] text-bone md:text-8xl">
            The current <span className="text-brass">meets</span> the work
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-ash">
            Offshore confidence and training-floor discipline meet in one
            cinematic wardrobe, built to move without losing its shape.
          </p>
        </Reveal>
      </div>
      <div role="group" aria-label="Water and iron campaign films">
        {PANELS.map((panel, pi) => (
          <article key={panel.world.id} className="relative overflow-hidden">
            <span
              aria-hidden="true"
              className="text-stroke-faint pointer-events-none absolute right-2 top-8 z-10 select-none font-display text-[11rem] leading-none md:text-[17rem]"
            >
              0{pi + 1}
            </span>
            <div className="relative min-h-[100svh]">
              <div className="absolute inset-0">
                <Film
                  src={panel.world.film}
                  poster={panel.world.poster}
                  label={`${panel.world.label} campaign`}
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0">
                <div className="mx-auto max-w-[1440px] px-5 pb-16 md:px-10">
                  <Reveal>
                    <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                      {panel.kicker}
                    </p>
                    <h3 className="mt-3 max-w-3xl font-display text-6xl uppercase leading-[0.9] text-bone md:text-8xl">
                      {panel.heading}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-7 text-bone/80">
                      {panel.body}
                    </p>
                    <Link
                      href={`/products/${panel.world.productHandle}`}
                      className="pointer-events-auto mt-7 inline-block bg-bone px-8 py-3.5 font-display text-base uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
                    >
                      {panel.cta} ↗
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
