import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROUTES = new Set([
  "/",
  "/focus",
  "/focus/drive",
  "/play",
  "/play/chakravyuha",
  "/play/mahabharata",
  "/play/traditions",
  "/discover",
  "/create",
  "/progress",
  "/how-it-works",
  "/privacy",
]);

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.jsx?$/.test(e.name)) files.push(p);
  }
})(join("src"));

const found = new Map();
const note = (from, route, via) => {
  if (!route.startsWith("/")) return;
  const clean = route.split("?")[0];
  if (!ROUTES.has(clean)) {
    found.set(`${from} -> ${route}`, via);
  }
};

for (const file of files) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(/to="([^"]+)"/g)) note(file, m[1], "to=");
  for (const m of src.matchAll(/to:\s*"([^"]+)"/g)) note(file, m[1], "to:");
  for (const m of src.matchAll(/navigate\("([^"]+)"\)/g)) note(file, m[1], "navigate()");
  for (const m of src.matchAll(/replace\("#([^"]*)"\)/g)) note(file, `/${m[1]}`, "hash");
}

if (found.size === 0) {
  console.log(`All internal links resolve to known routes (${ROUTES.size} routes).`);
} else {
  for (const [k, v] of found) console.log(`BROKEN ${k}  (${v})`);
  console.log(`\n${found.size} broken link target(s).`);
}
process.exit(found.size === 0 ? 0 : 1);
