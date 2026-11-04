import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * CAPTURE SURFACE (this pass) — Black Friday early-access signups.
 *
 * Stores each signup in the app's local data layer
 * (data/captures.local.json) with the same tags the live storefront uses
 * (newsletter, bf-first-to-know). This file is the local source of truth
 * until cutover, when this route is swapped for the Shopify
 * customer-create + marketing-consent flow. The form contract
 * ({ email, source, tags }) does not change at the swap.
 */
const FILE = path.join(process.cwd(), "data", "captures.local.json");

interface Capture {
  email: string;
  source: string;
  tags: string[];
  at: string;
}

export async function POST(req: Request) {
  let body: Partial<Capture>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }
  const email = (body.email ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 422 });
  }
  const capture: Capture = {
    email,
    source: body.source ?? "unknown",
    tags: body.tags ?? ["newsletter", "bf-first-to-know"],
    at: new Date().toISOString(),
  };
  let existing: Capture[] = [];
  try {
    existing = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    existing = [];
  }
  if (!existing.some((c) => c.email === email && c.source === capture.source)) {
    existing.push(capture);
    await fs.writeFile(FILE, JSON.stringify(existing, null, 1));
  }
  return NextResponse.json({ ok: true });
}
