// Renders the four concept variations and the live landing page to PNG.
// Usage: node design/tools/screenshot.mjs [baseUrl]
// Requires a global Playwright install (PLAYWRIGHT_BROWSERS_PATH honoured).
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const globalRoot = execSync("npm root -g").toString().trim();
const require = createRequire(path.join(globalRoot, "/"));
const { chromium } = require("playwright");

const root = path.resolve(new URL(".", import.meta.url).pathname, "..");
const out = path.join(root, "screenshots");
mkdirSync(out, { recursive: true });

const baseUrl = process.argv[2] || "";

const variants = ["01-night-shift", "02-sea-paper", "03-ledger", "04-dispatch-board"];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const v of variants) {
  await page.goto(`file://${path.join(root, "variants", `${v}.html`)}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${v}.png`), fullPage: true });
  await page.screenshot({ path: path.join(out, `${v}-hero.png`), fullPage: false });
  console.log("wrote", v);
}

if (baseUrl) {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(out, "live-landing.png"), fullPage: true });
  await page.screenshot({ path: path.join(out, "live-landing-hero.png"), fullPage: false });
  await page.getByRole("button", { name: /turn on/i }).click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(out, "live-landing-hero-covered.png"), fullPage: false });
  await page.goto(`${baseUrl}/demo`, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(out, "live-demo.png"), fullPage: true });
  console.log("wrote live pages");
}

await browser.close();
