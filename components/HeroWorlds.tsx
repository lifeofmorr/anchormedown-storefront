"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HERO_WORLDS } from "@/lib/campaign";

/**
 * Hero background — the live theme's dual-world campaign films
 * (sections/amd-hero.liquid). Two full-bleed films, Water (default) and
 * Iron, cross-faded by the 01/02 world toggle; the background links to the
 * active world's product ("Shop look"), and a motion toggle plays/pauses
 * the film — same controls, same order, same posters as the live store.
 */
export default function HeroWorlds() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const world = HERO_WORLDS[active];

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlaying(false);
    }
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active && playing) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [active, playing]);

  return (
    <div className="absolute inset-0">
      <Link
        href={`/products/${world.productHandle}`}
        aria-label={`Shop look: ${world.productTitle}`}
        className="absolute inset-0 block"
      >
        <Image
          src={world.poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {HERO_WORLDS.map((w, i) => (
          <video
            key={w.id}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-700 ${
              i === active ? "opacity-100" : "opacity-0"
            }`}
            muted
            loop
            playsInline
            preload={i === 0 ? "auto" : "none"}
            poster={w.poster}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src={w.film} type="video/mp4" />
          </video>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/20" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />
      </Link>

      {/* World toggle — 01 Water / 02 Iron, as live */}
      <div
        className="absolute left-5 top-24 z-20 flex border border-bone/25 bg-ink/70 backdrop-blur md:left-10"
        role="group"
        aria-label="Choose a world"
      >
        {HERO_WORLDS.map((w, i) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`inline-flex min-h-[42px] items-center gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
              i === active ? "bg-bone/10 text-bone" : "text-bone/50 hover:text-bone"
            }`}
          >
            <span aria-hidden="true">{`0${i + 1}`}</span>
            <span>{w.label}</span>
          </button>
        ))}
      </div>

      {/* Motion toggle — play/pause the background film, as live */}
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-pressed={playing}
        aria-label={playing ? "Pause background film" : "Play background film"}
        className="absolute right-5 top-24 z-20 inline-flex min-h-[42px] items-center gap-2 border border-bone/25 bg-ink/70 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur transition-colors hover:border-brass hover:text-brass md:right-10"
      >
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        <span>{playing ? "Pause film" : "Play film"}</span>
      </button>
    </div>
  );
}
