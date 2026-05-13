// ─────────────────────────────────────────────────────────────────────────────
// refresh-date.mjs
// Updates TODAY_LABEL in lib/data.ts to today's date in America/New_York time.
// Format: "Wednesday, May 13" (matches the dashboard's design).
//
// Designed to run from a GitHub Action that commits + pushes when the value
// changes. Idempotent: re-runs on the same day produce no change and no commit.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from "node:fs";

const DATA_FILE = "lib/data.ts";

// Format today's date in America/New_York as "Wednesday, May 13"
const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  weekday: "long",
  month: "short",
  day: "numeric",
});
const parts = fmt.formatToParts(new Date());
const weekday = parts.find((p) => p.type === "weekday").value;
const month   = parts.find((p) => p.type === "month").value;
const day     = parts.find((p) => p.type === "day").value;
const today   = `${weekday}, ${month} ${day}`;

const file = readFileSync(DATA_FILE, "utf8");

// Find: export const TODAY_LABEL = "..."
const pattern = /export const TODAY_LABEL = "([^"]*)";/;
const match = file.match(pattern);
if (!match) {
  console.error(`refresh-date: could not find TODAY_LABEL in ${DATA_FILE}`);
  process.exit(1);
}

const previous = match[1];
if (previous === today) {
  console.log(`refresh-date: TODAY_LABEL already "${today}" — no change.`);
  process.exit(0);
}

const updated = file.replace(pattern, `export const TODAY_LABEL = "${today}";`);
writeFileSync(DATA_FILE, updated);
console.log(`refresh-date: TODAY_LABEL "${previous}" → "${today}"`);
