"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
        router.push("/admin/login");
        router.refresh();
      }}
      className="border border-seam px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-ash transition-colors hover:border-brass hover:text-bone disabled:opacity-50"
    >
      {busy ? "Leaving…" : "Sign out"}
    </button>
  );
}
