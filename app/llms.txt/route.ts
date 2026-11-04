import { promises as fs } from "fs";
import path from "path";

/**
 * /llms.txt parity route. On the live store this file is served by the
 * "Arc: llms.txt" app through Shopify; a headless front end serves it
 * itself from data/llms.txt (extracted from the live store's llms-txt page).
 */
export async function GET() {
  const file = path.join(process.cwd(), "data", "llms.txt");
  const body = await fs.readFile(file, "utf8");
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
