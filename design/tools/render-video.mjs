// Deterministic HTML → MP4 renderer. No video credits, no cloud: every
// animation in the composition is a CSS animation on a 30-second timeline.
// For each frame we pause every animation, seek it to the frame's time,
// screenshot, then hand the frames to ffmpeg.
//
// Usage: node design/tools/render-video.mjs <composition.html> <out.mp4> <width> <height> [seconds] [fps]
import { createRequire } from "node:module";
import { execFileSync, execSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const [, , htmlArg, outArg, wArg, hArg, secArg = "30", fpsArg = "30"] = process.argv;
if (!htmlArg || !outArg || !wArg || !hArg) {
  console.error("usage: render-video.mjs <composition.html> <out.mp4> <width> <height> [seconds] [fps]");
  process.exit(1);
}

const globalRoot = execSync("npm root -g").toString().trim();
const require = createRequire(path.join(globalRoot, "/"));
const { chromium } = require("playwright");

const width = Number(wArg);
const height = Number(hArg);
const seconds = Number(secArg);
const fps = Number(fpsArg);
const total = seconds * fps;

const html = path.resolve(htmlArg);
const out = path.resolve(outArg);
const frames = path.join(path.dirname(out), `.frames-${path.basename(out, ".mp4")}`);
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

// ffmpeg with libx264: PATH first, then the static build shipped by the
// `imageio-ffmpeg` pip package (`pip install imageio-ffmpeg`). The ffmpeg
// bundled with Playwright is deliberately not used: it is a minimal build
// with no H.264 encoder and no MP4 muxer.
function findFfmpeg() {
  const candidates = [];
  if (process.env.FFMPEG) candidates.push(process.env.FFMPEG);
  candidates.push("ffmpeg");
  try {
    candidates.push(
      execSync('python3 -c "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"', { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim(),
    );
  } catch {}
  for (const bin of candidates) {
    try {
      const enc = execSync(`"${bin}" -hide_banner -encoders`, { stdio: ["ignore", "pipe", "ignore"] }).toString();
      if (enc.includes("libx264")) return bin;
    } catch {}
  }
  throw new Error("No ffmpeg with libx264 found. Set FFMPEG=/path/to/ffmpeg or `pip install imageio-ffmpeg`.");
}
const ffmpeg = findFfmpeg();

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(`file://${html}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);

// Freeze the timeline: pause everything so nothing drifts between frames.
await page.evaluate(() => {
  for (const a of document.getAnimations({ subtree: true })) a.pause();
});

const t0 = Date.now();
for (let i = 0; i < total; i++) {
  const ms = (i / fps) * 1000;
  await page.evaluate((ms) => {
    for (const a of document.getAnimations({ subtree: true })) {
      a.pause();
      a.currentTime = ms;
    }
    if (typeof window.__seek === "function") window.__seek(ms);
  }, ms);
  const buf = await page.screenshot({ type: "jpeg", quality: 92, animations: "allow", caret: "hide" });
  writeFileSync(path.join(frames, `f${String(i).padStart(5, "0")}.jpg`), buf);
  if (i % (fps * 5) === 0) console.log(`frame ${i}/${total} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
}
await browser.close();

execFileSync(
  ffmpeg,
  [
    "-y",
    "-framerate", String(fps),
    "-i", path.join(frames, "f%05d.jpg"),
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "18",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    out,
  ],
  { stdio: "inherit" },
);
rmSync(frames, { recursive: true, force: true });
console.log("wrote", out);
