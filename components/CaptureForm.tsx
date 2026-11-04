"use client";

import { useState, useTransition } from "react";
import { submitCaptureAction } from "@/app/actions/capture";
import type { CaptureSource } from "@/lib/validations";

/**
 * Email capture surface (Black Friday early access, giveaway, newsletter).
 *
 * Submits through the capture server action: Zod validation →
 * token-bucket rate limit → Prisma persistence in the app's own
 * captures database. Consent is an explicit checkbox — the row records
 * exactly what the visitor agreed to.
 */
export default function CaptureForm({
  source = "bf-early-access",
}: {
  source?: CaptureSource;
}) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const isBf = source === "bf-early-access";
  const consentLabel = isBf
    ? "Email me when early access opens."
    : source === "giveaway"
      ? "Email me about the draw and the result."
      : "Email me the drop news.";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !consent) return;
    startTransition(async () => {
      const result = await submitCaptureAction({ email, source, consent });
      if (result.ok) {
        setState("done");
      } else {
        setMessage(
          result.error.fields?.email ??
            result.error.message ??
            "Something went wrong — try again.",
        );
        setState("error");
      }
    });
  }

  if (state === "done") {
    return (
      <div className="border border-brass/60 bg-brass/10 px-5 py-4">
        <p className="text-sm font-medium text-bone">You are on the list. Stay anchored.</p>
        {isBf && (
          <p className="mt-1 text-sm text-bone/75">
            First word when the drop opens — November 27.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Your email"
          className="flex-1 border border-seam bg-ink px-5 py-4 text-bone placeholder:text-ash focus:border-brass focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending || !consent}
          className="bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass disabled:opacity-60"
        >
          {isPending ? "Joining…" : "Put me on the list"}
        </button>
      </div>
      <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-left text-xs leading-5 text-ash">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#C8A24B]"
        />
        <span>{consentLabel} One list, no noise — unsubscribe anytime.</span>
      </label>
      {state === "error" && <p className="mt-2 text-sm text-red-400">{message}</p>}
    </form>
  );
}
