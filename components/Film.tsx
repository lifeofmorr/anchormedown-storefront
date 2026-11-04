"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Campaign film surface — the headless counterpart of the live theme's
 * lazy campaign films (amd-campaign-films / amd-social-runway /
 * amd-world-experience). The poster still renders as a real image layer
 * (exactly how the live theme layers its campaign media) with the muted
 * looping mp4 over it; plays while in view, pauses off-screen, and always
 * carries the live site's Play/Pause film toggle. Honors
 * prefers-reduced-motion (starts paused).
 */
export default function Film({
  src,
  poster,
  label = "film",
  autoplayInView = true,
  sizes = "100vw",
  className = "",
}: {
  src: string;
  poster: string;
  label?: string;
  autoplayInView?: boolean;
  sizes?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    const wrap = wrapRef.current;
    if (!v || !wrap || !autoplayInView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!userPaused.current) {
              v.play()
                .then(() => setPlaying(true))
                .catch(() => {});
            }
          } else {
            v.pause();
            setPlaying(false);
          }
        });
      },
      { threshold: 0.2 }
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [autoplayInView]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative h-full w-full overflow-hidden ${className}`}>
      <Image
        src={poster}
        alt=""
        fill
        sizes={sizes}
        className="object-cover"
      />
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 border border-bone/25 bg-ink/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur transition-colors hover:border-brass hover:text-brass"
      >
        <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        <span>{playing ? "Pause film" : "Play film"}</span>
      </button>
    </div>
  );
}
