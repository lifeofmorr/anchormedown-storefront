import { PrismaClient } from "@prisma/client";

/**
 * Seed — realistic sample captures for local/staging ONLY.
 *
 * These rows exist so the /admin surface can be developed and verified
 * against plausible data (a launch-week curve: a quiet newsletter base,
 * a giveaway bump, then the Black Friday early-access ramp). They are
 * sample rows in a staging database — the production database starts
 * empty and fills only from the app's real forms.
 *
 * Run: npm run db:seed   (idempotent — upserts on email+source)
 */
const prisma = new PrismaClient();

type SeedRow = { email: string; source: string; daysAgo: number; hour: number };

const rows: SeedRow[] = [
  // Newsletter base — steady trickle over the last three weeks.
  { email: "marcus.t.wren@gmail.com", source: "newsletter", daysAgo: 20, hour: 7 },
  { email: "j.delacroix84@yahoo.com", source: "newsletter", daysAgo: 19, hour: 21 },
  { email: "kaitlyn.osei@gmail.com", source: "newsletter", daysAgo: 18, hour: 12 },
  { email: "d.holloway.iron@gmail.com", source: "newsletter", daysAgo: 17, hour: 6 },
  { email: "sofia.marin.88@outlook.com", source: "newsletter", daysAgo: 16, hour: 19 },
  { email: "trent@harborfit.co", source: "newsletter", daysAgo: 15, hour: 9 },
  { email: "b.nakamura@gmail.com", source: "newsletter", daysAgo: 14, hour: 22 },
  { email: "alyssa.ferro@icloud.com", source: "newsletter", daysAgo: 13, hour: 8 },
  { email: "cody.brandt.7@gmail.com", source: "newsletter", daysAgo: 12, hour: 17 },
  { email: "r.okafor.lifts@gmail.com", source: "newsletter", daysAgo: 11, hour: 5 },
  { email: "jenna.kowalski@gmail.com", source: "newsletter", daysAgo: 10, hour: 20 },
  { email: "m.sandoval.315@yahoo.com", source: "newsletter", daysAgo: 9, hour: 11 },
  { email: "priya.raman.92@gmail.com", source: "newsletter", daysAgo: 8, hour: 14 },
  { email: "hunter.gillespie@outlook.com", source: "newsletter", daysAgo: 7, hour: 18 },
  // Giveaway entries — the bump when the draw opened.
  { email: "zach.meridian@gmail.com", source: "giveaway", daysAgo: 6, hour: 10 },
  { email: "t.hollis.ward@gmail.com", source: "giveaway", daysAgo: 6, hour: 13 },
  { email: "emma.castellano@icloud.com", source: "giveaway", daysAgo: 6, hour: 21 },
  { email: "lone.pierce.44@gmail.com", source: "giveaway", daysAgo: 5, hour: 8 },
  { email: "nadia.ferreira.m@gmail.com", source: "giveaway", daysAgo: 5, hour: 16 },
  { email: "g.petrov.88@gmail.com", source: "giveaway", daysAgo: 5, hour: 23 },
  { email: "isabelle.fonseca@yahoo.com", source: "giveaway", daysAgo: 4, hour: 9 },
  { email: "owen.taggart@gmail.com", source: "giveaway", daysAgo: 4, hour: 15 },
  { email: "mira.kowalski@outlook.com", source: "giveaway", daysAgo: 4, hour: 19 },
  // Black Friday early access — the ramp as the date gets close.
  { email: "derek.vance.iron@gmail.com", source: "bf-early-access", daysAgo: 3, hour: 7 },
  { email: "s.bennett.anchor@gmail.com", source: "bf-early-access", daysAgo: 3, hour: 12 },
  { email: "tommy.reeves.12@gmail.com", source: "bf-early-access", daysAgo: 3, hour: 20 },
  { email: "a.castillo.waves@gmail.com", source: "bf-early-access", daysAgo: 2, hour: 6 },
  { email: "rachel.dumont@icloud.com", source: "bf-early-access", daysAgo: 2, hour: 11 },
  { email: "k.fitzgerald.301@gmail.com", source: "bf-early-access", daysAgo: 2, hour: 15 },
  { email: "jules.moreau.7@yahoo.com", source: "bf-early-access", daysAgo: 2, hour: 22 },
  { email: "c.harrington.lift@gmail.com", source: "bf-early-access", daysAgo: 1, hour: 8 },
  { email: "violet.ashford@gmail.com", source: "bf-early-access", daysAgo: 1, hour: 13 },
  { email: "n.petrovski@outlook.com", source: "bf-early-access", daysAgo: 1, hour: 18 },
  { email: "sam.okafor.1990@gmail.com", source: "bf-early-access", daysAgo: 0, hour: 7 },
  { email: "lena.hartwig@gmail.com", source: "bf-early-access", daysAgo: 0, hour: 10 },
  // A couple of people on two lists — the unique key keeps them distinct per source.
  { email: "marcus.t.wren@gmail.com", source: "bf-early-access", daysAgo: 1, hour: 9 },
  { email: "alyssa.ferro@icloud.com", source: "giveaway", daysAgo: 5, hour: 12 },
];

async function main() {
  let written = 0;
  for (const row of rows) {
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - row.daysAgo);
    createdAt.setHours(row.hour, Math.floor(Math.random() * 60), 0, 0);
    await prisma.capture.upsert({
      where: { email_source: { email: row.email, source: row.source } },
      update: {},
      create: {
        email: row.email,
        source: row.source,
        consent: true,
        createdAt,
      },
    });
    written += 1;
  }
  const total = await prisma.capture.count();
  console.log(`Seed complete: ${written} rows upserted, ${total} captures in database.`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
