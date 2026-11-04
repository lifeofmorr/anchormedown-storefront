"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: { message: string } };
      if (data.ok) {
        const from = searchParams.get("from");
        router.push(from && from.startsWith("/admin") ? from : "/admin");
        router.refresh();
        return;
      }
      setMessage(data.error?.message ?? "That password does not open this door.");
      setState("error");
    } catch {
      setMessage("Something went wrong — try again.");
      setState("error");
    }
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md space-y-4">
      <div>
        <p className="text-[11px] uppercase tracking-[0.35em] text-brass">Anchor Me Down · Operator</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none text-bone">
          The desk is<br />locked.
        </h1>
        <p className="mt-3 text-sm text-ash">
          One operator, one password. Shoppers never see this door — their
          accounts live with Shopify, where they belong.
        </p>
      </div>
      <input
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Operator password"
        className="w-full border border-seam bg-ink px-5 py-4 text-bone placeholder:text-ash focus:border-brass focus:outline-none"
        aria-label="Operator password"
      />
      {state === "error" && <p className="text-sm text-red-400">{message}</p>}
      <button
        type="submit"
        disabled={state === "sending" || !password}
        className="w-full bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass disabled:opacity-60"
      >
        {state === "sending" ? "Opening…" : "Open the desk"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
