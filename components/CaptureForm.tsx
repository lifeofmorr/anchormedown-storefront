"use client";

import { useState } from "react";

/**
 * Black Friday early-access capture surface.
 * This pass: posts to /api/capture, which stores the signup in the app's
 * local data layer (data/captures.local.json). At cutover this endpoint is
 * swapped for the Shopify customer-create / marketing-consent flow — the
 * form itself does not change. Same tags as the live store: newsletter,
 * bf-first-to-know.
 */
export default function CaptureForm({ source = "black-friday" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, tags: ["newsletter", "bf-first-to-know"] }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="border border-brass/60 bg-brass/10 px-5 py-4 text-sm text-bone">
        You&apos;re on the list. First word when the drop opens — November 27.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 border border-seam bg-ink px-5 py-4 text-bone placeholder:text-ash focus:border-brass focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass disabled:opacity-60"
      >
        {state === "sending" ? "Joining…" : "Put me on the list"}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-400">Something went wrong — try again.</p>
      )}
    </form>
  );
}
