// Builds the 5-minute demo video from a storyboard JSON:
//   1. synthesizes the voiceover for every scene with Piper (local, offline),
//   2. sizes each scene to its voiceover, lays the scenes end to end,
//   3. writes a self-contained HTML composition (design/video/03-demo/composition.html),
//   4. renders it frame by frame with render-video.mjs,
//   5. mixes the voiceover track and muxes it into the MP4.
//
// Usage: node design/tools/build-demo-video.mjs design/video/03-demo/storyboard.json [--voice en_US-ryan-high] [--fps 30] [--render-only|--no-render]
// Requires: python3 -m piper (pip install piper-tts) with the voice .onnx in design/video/03-demo/voices/ or $PIPER_VOICES.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const argv = process.argv.slice(2);
const storyboardPath = path.resolve(argv[0]);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const VOICE = opt("--voice", "en_US-ryan-high");
const FPS = Number(opt("--fps", "30"));
const NO_RENDER = argv.includes("--no-render");

const sb = JSON.parse(readFileSync(storyboardPath, "utf8"));
const outDir = path.dirname(storyboardPath);
const voDir = path.join(outDir, "vo");
mkdirSync(voDir, { recursive: true });
const voicesDir = process.env.PIPER_VOICES || path.join(outDir, "voices");
const model = path.join(voicesDir, `${VOICE}.onnx`);
if (!existsSync(model)) throw new Error(`voice model not found: ${model}`);

const tools = path.dirname(new URL(import.meta.url).pathname);
const repo = path.resolve(tools, "..", "..");

/* ------------------------------------------------------------- audio --- */

function wavSeconds(file) {
  const b = readFileSync(file);
  // RIFF header: sample rate @24, byte rate @28, data chunk follows "data"
  const byteRate = b.readUInt32LE(28);
  let i = 12;
  while (i < b.length - 8) {
    const id = b.toString("ascii", i, i + 4);
    const size = b.readUInt32LE(i + 4);
    if (id === "data") return size / byteRate;
    i += 8 + size + (size % 2);
  }
  return 0;
}

function synth(text, file) {
  if (existsSync(file) && existsSync(file + ".txt") && readFileSync(file + ".txt", "utf8") === text) return;
  const r = spawnSync("python3", ["-m", "piper", "-m", model, "-f", file, "--sentence-silence", "0.35"], { input: text, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`piper failed: ${r.stderr}`);
  writeFileSync(file + ".txt", text);
}

/* ---------------------------------------------------------- timeline --- */

let t = 0;
const scenes = sb.scenes.map((s, i) => {
  const wav = path.join(voDir, `${String(i).padStart(2, "0")}-${s.id}.wav`);
  synth(s.vo, wav);
  const voLen = wavSeconds(wav);
  const lead = s.lead ?? 0.9;                 // silence before the voice starts
  const tail = s.tail ?? 1.4;                 // breathing room after the voice ends
  const dur = Math.max(s.min_s ?? 0, lead + voLen + tail);
  const sc = { ...s, index: i, wav, voLen, lead, start: t, dur };
  t += dur;
  return sc;
});
const TOTAL = Math.ceil(t * 10) / 10;
console.log(`timeline: ${scenes.length} scenes, ${TOTAL.toFixed(1)} s`);
for (const s of scenes) console.log(`  ${s.start.toFixed(1).padStart(6)}s  ${s.dur.toFixed(1).padStart(5)}s  ${s.id}  (vo ${s.voLen.toFixed(1)}s)`);

/* ------------------------------------------------------- composition --- */

const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const f1 = (n) => `${n.toFixed(2)}s`;

// Reveal helper: n items spread between the voice start and 1.5 s before the scene ends.
function reveals(s, n, from = 0.15) {
  const a = s.start + s.lead + from;
  const b = s.start + s.dur - 1.6;
  const step = n > 1 ? Math.max(0.35, (b - a) / (n - 1)) : 0;
  return Array.from({ length: n }, (_, i) => a + Math.min(i * step, b - a));
}

function captions(s) {
  const lines = s.on_screen || [];
  const ts = reveals(s, lines.length + 1, 0);
  return `<div class="copy">
    <div class="eyebrow up" style="--t:${f1(s.start + 0.1)}">${esc(s.chapter || "")}</div>
    <h2 class="up" style="--t:${f1(s.start + 0.25)}">${esc(s.title)}</h2>
    ${lines.map((l, i) => `<p class="cap up" style="--t:${f1(ts[i + 1])}">${esc(l)}</p>`).join("")}
  </div>`;
}

const LAYOUT = {
  title(s) {
    const lines = s.on_screen || [];
    const ts = reveals(s, lines.length + 1, 0);
    return `<div class="center">
      <div class="eyebrow up" style="--t:${f1(s.start + 0.1)}">${esc(s.chapter || "")}</div>
      <h1 class="up" style="--t:${f1(s.start + 0.3)}">${s.title_html || esc(s.title)}</h1>
      ${lines.map((l, i) => `<p class="lede up" style="--t:${f1(ts[i + 1])}">${esc(l)}</p>`).join("")}
    </div>`;
  },
  clock(s) {
    return `${captions(s)}
    <div class="stagebox">
      <div class="clock up" style="--t:${f1(s.start + 0.2)}"><div class="face"><div class="h"></div><div class="m"></div><div class="pin"></div></div><div class="t">${esc(s.data.time)}</div></div>
      <div class="phone up" style="--t:${f1(s.start + 0.5)}"><div class="ring" style="--t:${f1(s.start + 0.8)}"><i></i><i></i><i></i></div><div class="body" style="--t:${f1(s.start + 0.8)}"><div class="screen">${esc(s.data.screen).replace(/\n/g, "<br>")}</div></div></div>
      ${s.data.house ? `<div class="house up" style="--t:${f1(s.start + 0.3)}">${HOUSE}</div>` : ""}
    </div>`;
  },
  thread(s) {
    const msgs = s.data.messages;
    const ts = reveals(s, msgs.length, 0.6);
    return `${captions(s)}
    <div class="phoneframe up" style="--t:${f1(s.start + 0.2)}">
      <div class="phead"><span>${esc(s.data.header || "")}</span><span class="mono">${esc(s.data.time || "")}</span></div>
      <div class="msgs">${msgs.map((m, i) => `<div class="msg ${m.from} pop" style="--t:${f1(ts[i])}">${m.t ? `<small>${esc(m.t)}</small>` : ""}${esc(m.text)}</div>`).join("")}</div>
    </div>`;
  },
  beats(s) {
    const cols = s.data.columns; // [{label, tone, beats:[{t, who, text, tone}]}]
    const n = Math.max(...cols.map((c) => c.beats.length));
    const ts = reveals(s, n, 0.5);
    return `${captions(s)}
    <div class="beatcols up" style="--t:${f1(s.start + 0.2)}">
      ${cols.map((c) => `<div class="col ${c.tone}"><div class="colhead">${esc(c.label)}</div>
        ${c.beats.map((b, i) => `<div class="beat ${b.tone} up" style="--t:${f1(ts[i])}"><span class="mono">${esc(b.t)}</span><span class="who">${esc(b.who)}</span><span class="txt">${esc(b.text)}</span></div>`).join("")}
      </div>`).join("")}
    </div>`;
  },
  list(s) {
    const items = s.data.items; // [{n, t, d}]
    const ts = reveals(s, items.length, 0.5);
    return `${captions(s)}
    <ol class="steps up" style="--t:${f1(s.start + 0.2)}">
      ${items.map((it, i) => `<li class="up" style="--t:${f1(ts[i])}"><span class="n">${esc(it.n ?? String(i + 1).padStart(2, "0"))}</span><div><b>${esc(it.t)}</b><p>${esc(it.d || "")}</p></div></li>`).join("")}
    </ol>`;
  },
  grid(s) {
    const items = s.data.items; // [{t, d}]
    const ts = reveals(s, items.length, 0.5);
    return `${captions(s)}
    <div class="grid up" style="--t:${f1(s.start + 0.2)}">
      ${items.map((it, i) => `<div class="cell up" style="--t:${f1(ts[i])}"><span class="x">✕</span><div><b>${esc(it.t)}</b><p>${esc(it.d || "")}</p></div></div>`).join("")}
    </div>`;
  },
  tickets(s) {
    const items = s.data.tickets; // [{no, at, name, town, said, stamp, sub, ok}]
    const ts = reveals(s, items.length, 0.5);
    return `${captions(s)}
    <div class="stack">
      ${items.map((tk, i) => `<article class="ticket ${tk.ok ? "booked" : ""} up" style="--t:${f1(ts[i])}"><small class="mono">#${esc(tk.no)} · ${esc(tk.at)}</small><div class="who">${esc(tk.name)} <span>· ${esc(tk.town)}</span></div><p>“${esc(tk.said)}”</p><div class="stamp ${tk.ok ? "ok" : "miss"} pop" style="--t:${f1(ts[i] + 0.7)}">${esc(tk.stamp)}<b>${esc(tk.sub || "")}</b></div></article>`).join("")}
    </div>`;
  },
  pricing(s) {
    return `${captions(s)}
    <div class="price up" style="--t:${f1(s.start + 0.3)}">
      <div class="head"><span>Work order — recovery setup</span><span>No. 0001</span></div>
      <div class="pgrid">
        <div><div class="lbl">One-time setup</div><div class="amt">$2,500</div><p>Paid once, before any work starts.</p></div>
        <div><div class="lbl">Then, monthly</div><div class="amt mo">$750</div><p>Starts the day you go live. Cancel any time.</p></div>
      </div>
      <div class="pfoot up" style="--t:${f1(s.start + s.lead + 2)}">No revenue share. No per-call fee. No pay link until you say yes on a call.</div>
    </div>`;
  },
  recap(s) {
    const rows = s.data.rows; // [{k, v}]
    const ts = reveals(s, rows.length, 0.6);
    return `${captions(s)}
    <div class="mail up" style="--t:${f1(s.start + 0.3)}">
      <div class="mhead"><div><b>Weekly recap</b> · ${esc(s.data.week)}</div><div class="mono">to: you</div></div>
      ${rows.map((r, i) => `<div class="mrow up" style="--t:${f1(ts[i])}"><span>${esc(r.k)}</span><b class="mono">${esc(r.v)}</b></div>`).join("")}
      <div class="mfoot">Illustrative example, not a promise. Your real numbers land in the same format.</div>
    </div>`;
  },
};

const HOUSE = `<svg viewBox="0 0 300 200" aria-hidden><polygon points="60,110 150,50 240,110" fill="#173B54"/><rect x="72" y="108" width="156" height="72" fill="#1E4A66"/><rect x="185" y="62" width="18" height="28" fill="#173B54"/><rect x="140" y="135" width="28" height="45" fill="#0f2b3f"/><circle cx="105" cy="138" r="40" fill="url(#g)"/><rect x="88" y="122" width="36" height="32" rx="2" fill="#FFD48A"/><defs><radialGradient id="g"><stop offset="0" stop-color="#F08A24" stop-opacity=".8"/><stop offset="1" stop-color="#F08A24" stop-opacity="0"/></radialGradient></defs><text x="150" y="30" text-anchor="middle" font-family="JetBrains Mono" font-size="12" fill="#9DB4C4">54°F inside</text></svg>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(sb.title)}</title>
<link rel="stylesheet" href="../../fonts/fraunces.css"><link rel="stylesheet" href="../../fonts/dmsans.css"><link rel="stylesheet" href="../../fonts/jetbrains.css">
<style>
:root{--ocean:#0B2A3F;--deep:#071E2E;--mid:#123A55;--muted:#9DB4C4;--white:#F4F8FB;--cta:#F08A24;--booked:#2FB57A;--booked-ink:#1F8A5B;--missed:#E2604F;--missed-ink:#C0392B;--trust:#5FA8DC;
--serif:"Fraunces",Georgia,serif;--sans:"DM Sans",system-ui,sans-serif;--mono:"JetBrains Mono",monospace}
*{box-sizing:border-box}html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:var(--deep);color:var(--white);font-family:var(--sans);-webkit-font-smoothing:antialiased}
.stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(1400px circle at 15% -10%,rgba(30,95,140,.55),transparent 60%),radial-gradient(900px circle at 92% 110%,rgba(240,138,36,.14),transparent 55%),linear-gradient(180deg,var(--mid) 0%,var(--ocean) 55%,var(--deep) 100%)}
.stage::after{content:"";position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(rgba(255,255,255,.07) 1.5px,transparent 1.5px);background-size:40px 40px;-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.7),transparent 80%);mask-image:linear-gradient(180deg,rgba(0,0,0,.7),transparent 80%)}
.scene{position:absolute;inset:0;opacity:0;visibility:hidden;animation:scene var(--d) var(--t) both linear}
@keyframes scene{0%{opacity:0;visibility:hidden}4%{opacity:1;visibility:visible}96%{opacity:1;visibility:visible}100%{opacity:0;visibility:hidden}}
.up{opacity:0;animation:up .7s var(--t) both cubic-bezier(.22,1,.36,1)}@keyframes up{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
.pop{opacity:0;animation:pop .45s var(--t) both cubic-bezier(.34,1.56,.64,1)}@keyframes pop{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
.mono{font-family:var(--mono)}
.brand{position:absolute;left:80px;top:54px;display:flex;align-items:center;gap:14px;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600;z-index:3}
.brand b{display:grid;place-items:center;width:38px;height:38px;border-radius:8px;background:var(--white);color:var(--ocean);font-family:var(--serif);font-size:21px}
.chapterbar{position:absolute;right:80px;top:60px;font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600;z-index:3}
.progress{position:absolute;left:0;bottom:0;height:6px;background:var(--cta);width:0;animation:bar ${TOTAL}s 0s linear both;z-index:3}@keyframes bar{to{width:100%}}
.eyebrow{font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--cta);font-weight:600;min-height:20px}
h1{font-family:var(--serif);font-weight:400;font-size:104px;line-height:1;letter-spacing:-.015em;margin:22px 0 0;text-wrap:balance}
h1 em{font-style:italic;color:var(--muted)}
h2{font-family:var(--serif);font-weight:400;font-size:64px;line-height:1.04;letter-spacing:-.01em;margin:18px 0 0;text-wrap:balance}
.lede{font-size:32px;line-height:1.45;color:rgba(244,248,251,.78);margin:26px auto 0;max-width:30ch}
.center{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:0 200px}
.center>div{max-width:1400px}
.copy{position:absolute;left:100px;top:200px;width:640px}
.cap{font-size:27px;line-height:1.4;color:rgba(244,248,251,.78);margin:22px 0 0;padding-left:22px;border-left:3px solid rgba(240,138,36,.6)}
/* clock */
.stagebox{position:absolute;left:880px;top:160px;width:960px;height:760px}
.clock{position:absolute;left:60px;top:40px;width:360px;text-align:center}
.clock .face{width:300px;height:300px;margin:0 auto;border-radius:50%;background:var(--ocean);border:8px solid #3b6f8f;position:relative;box-shadow:0 30px 80px rgba(0,0,0,.4)}
.clock .h,.clock .m{position:absolute;left:50%;bottom:50%;transform-origin:50% 100%;border-radius:4px;background:#fff}
.clock .h{width:10px;height:80px;margin-left:-5px;transform:rotate(275deg)}.clock .m{width:8px;height:120px;margin-left:-4px;background:var(--cta);transform:rotate(84deg)}
.clock .pin{position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#fff}
.clock .t{font-family:var(--mono);font-size:40px;margin-top:22px}
.phone{position:absolute;left:520px;top:80px;width:210px;height:300px}
.phone .body{position:absolute;inset:0;border-radius:32px;background:#0E1F2D;border:6px solid #3b6f8f;animation:shake .5s var(--t) 9 ease-in-out}
.phone .screen{position:absolute;inset:22px;border-radius:18px;background:#FFD48A;display:grid;place-items:center;font-family:var(--mono);font-size:16px;color:#0B2A3F;text-align:center;line-height:1.4}
@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
.ring{position:absolute;left:-40px;top:70px;width:290px;height:160px}
.ring i{position:absolute;inset:0;border-radius:50%;border:4px solid var(--cta);opacity:0;animation:ring 1.2s var(--t) 4 ease-out}
.ring i:nth-child(2){animation-delay:calc(var(--t) + .4s)}.ring i:nth-child(3){animation-delay:calc(var(--t) + .8s)}
@keyframes ring{0%{transform:scale(.6);opacity:.9}100%{transform:scale(1.5);opacity:0}}
.house{position:absolute;left:60px;top:420px;width:560px}.house svg{width:100%;height:auto}
/* thread */
.phoneframe{position:absolute;left:880px;top:150px;width:900px;background:#fff;color:#0E1F2D;border-radius:28px;box-shadow:0 30px 80px rgba(0,0,0,.45);overflow:hidden}
.phead{display:flex;justify-content:space-between;padding:22px 32px;background:#F2F7FA;border-bottom:1px solid #D3DFE8;font-size:20px;font-weight:600;color:#4F6472}
.msgs{padding:28px 32px 32px;display:grid;gap:16px;min-height:520px;align-content:start}
.msg{max-width:78%;padding:18px 24px;border-radius:24px;font-size:25px;line-height:1.38}
.msg small{display:block;font-family:var(--mono);font-size:14px;opacity:.6;margin-bottom:6px}
.msg.shop{background:#1E5F8C;color:#fff;border-bottom-left-radius:6px;justify-self:start}
.msg.them{background:#E8EEF3;color:#0E1F2D;border-bottom-right-radius:6px;justify-self:end}
.msg.sys{background:transparent;color:#4F6472;font-family:var(--mono);font-size:16px;justify-self:center;padding:4px 0}
/* beats */
.beatcols{position:absolute;left:780px;top:150px;width:1060px;display:grid;grid-template-columns:1fr 1fr;gap:20px}
.col{border:1px solid rgba(255,255,255,.14);border-radius:20px;background:rgba(255,255,255,.04);padding:22px 24px}
.col.bad .colhead{color:var(--missed)}.col.good .colhead{color:var(--booked)}
.colhead{font-size:14px;letter-spacing:.16em;text-transform:uppercase;font-weight:700;margin-bottom:14px}
.beat{display:grid;grid-template-columns:120px 1fr;gap:6px 14px;padding:15px 0;border-top:1px solid rgba(255,255,255,.1);font-size:23px;line-height:1.35}
.beat .mono{font-size:16px;color:var(--muted);padding-top:3px}.beat .who{font-weight:600;font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.beat .txt{grid-column:2;color:rgba(244,248,251,.9)}
.beat.bad .txt{color:#F4B3AA}.beat.good .txt{color:#BFF0D7}
/* list, grid */
.steps{position:absolute;left:820px;top:170px;width:1000px;margin:0;padding:0;list-style:none;display:grid;gap:18px}
.steps li{display:grid;grid-template-columns:70px 1fr;gap:20px;align-items:start;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(255,255,255,.04);padding:22px 26px}
.steps .n{font-family:var(--mono);font-size:18px;color:var(--cta);padding-top:6px}
.steps b{font-family:var(--serif);font-weight:400;font-size:32px;line-height:1.1;display:block}
.steps p{margin:8px 0 0;font-size:21px;line-height:1.4;color:rgba(244,248,251,.75)}
.grid{position:absolute;left:820px;top:170px;width:1000px;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cell{display:flex;gap:16px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(255,255,255,.04);padding:22px 24px}
.cell .x{color:var(--missed);font-size:22px;padding-top:6px}
.cell b{font-family:var(--serif);font-weight:400;font-size:30px;line-height:1.1;display:block}
.cell p{margin:8px 0 0;font-size:19px;line-height:1.4;color:rgba(244,248,251,.72)}
/* tickets */
.stack{position:absolute;right:100px;top:190px;display:grid;gap:22px}
.ticket{position:relative;background:#fff;color:#0E1F2D;border-radius:18px;padding:26px 220px 26px 34px;box-shadow:0 24px 60px rgba(0,0,0,.45);border-left:8px solid var(--missed);width:800px}
.ticket.booked{border-left-color:var(--booked)}.ticket small{font-size:20px;color:#4F6472}
.ticket .who{font-family:var(--serif);font-size:38px;margin-top:4px}.ticket .who span{color:#4F6472}.ticket p{margin:6px 0 0;font-size:26px;color:#4F6472}
.stamp{position:absolute;right:28px;top:50%;margin-top:-40px;border:4px solid;border-radius:10px;padding:10px 18px;text-align:center;font-weight:800;font-size:22px;letter-spacing:.12em;text-transform:uppercase;line-height:1;transform:rotate(-8deg)}
.stamp b{display:block;font-weight:500;font-size:16px;letter-spacing:0;text-transform:none;margin-top:6px;opacity:.85}
.stamp.miss{color:var(--missed-ink);border-color:var(--missed-ink);background:#FBE7E4}.stamp.ok{color:var(--booked-ink);border-color:var(--booked-ink);background:#E4F4EC}
/* pricing */
.price{position:absolute;left:860px;top:200px;width:960px;border:2px solid rgba(255,255,255,.16);border-radius:22px;background:rgba(255,255,255,.05);overflow:hidden}
.price .head{display:flex;justify-content:space-between;padding:18px 32px;border-bottom:2px dashed rgba(255,255,255,.16);font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.pgrid{display:grid;grid-template-columns:1fr 1fr}.pgrid>div{padding:36px 32px}.pgrid>div+div{border-left:2px solid rgba(255,255,255,.16)}
.price .lbl{font-size:15px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);font-weight:600}
.price .amt{font-family:var(--serif);font-size:120px;line-height:1;margin-top:14px}.price .amt.mo{color:var(--muted)}
.price p{font-size:23px;color:rgba(244,248,251,.75);margin:14px 0 0;line-height:1.4}
.pfoot{border-top:2px solid rgba(255,255,255,.16);padding:20px 32px;font-size:20px;color:var(--muted)}
/* recap mail */
.mail{position:absolute;left:860px;top:170px;width:960px;background:#fff;color:#0E1F2D;border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.45);overflow:hidden}
.mhead{display:flex;justify-content:space-between;padding:24px 32px;background:#F2F7FA;border-bottom:1px solid #D3DFE8;font-size:22px;color:#4F6472}
.mhead b{color:#0E1F2D;font-family:var(--serif);font-weight:400;font-size:28px}
.mrow{display:flex;justify-content:space-between;padding:20px 32px;border-bottom:1px solid #E6EEF3;font-size:26px}
.mrow b{color:#1F8A5B;font-weight:600}
.mfoot{padding:18px 32px;font-size:17px;color:#4F6472}
</style></head><body><div class="stage">
<div class="brand"><b>H</b> ${esc(sb.brand)}</div>
${scenes.map((s) => `<section class="scene" style="--t:${f1(s.start)};--d:${f1(s.dur)}">
  <div class="chapterbar">${esc(s.chapter || "")}</div>
  ${LAYOUT[s.layout](s)}
</section>`).join("\n")}
<div class="progress"></div>
</div></body></html>`;

const compPath = path.join(outDir, "composition.html");
writeFileSync(compPath, html);
writeFileSync(path.join(outDir, "timeline.json"), JSON.stringify(scenes.map((s) => ({ id: s.id, start: s.start, dur: s.dur, voLen: s.voLen })), null, 2));
console.log("wrote", compPath);
if (NO_RENDER) process.exit(0);

/* ------------------------------------------------------------ render --- */

const silent = path.join(outDir, "silent.mp4");
execFileSync("node", [path.join(tools, "render-video.mjs"), compPath, silent, "1920", "1080", String(TOTAL), String(FPS)], { stdio: "inherit" });

/* --------------------------------------------------------------- mix --- */

const mixPy = `
import wave, struct, sys, json, math
scenes = json.loads(sys.argv[1]); total = float(sys.argv[2]); out = sys.argv[3]
rate = None; frames = None
for s in scenes:
    w = wave.open(s['wav'], 'rb'); r = w.getframerate()
    if rate is None:
        rate = r; frames = bytearray(int(total * rate) * 2)
    data = w.readframes(w.getnframes()); w.close()
    if w.getnchannels() != 1 or w.getsampwidth() != 2: raise SystemExit('expected 16-bit mono wav')
    off = int((s['start'] + s['lead']) * rate) * 2
    n = min(len(data), len(frames) - off)
    if n > 0: frames[off:off+n] = data[:n]
    if s.get('sfx') == 'ring':
        # classic US ring: 440+480 Hz, 2 s on / 4 s off, twice, quiet
        t0 = int(s['start'] * rate)
        for k in range(2):
            for i in range(int(2 * rate)):
                idx = (t0 + k * 6 * rate // 1 + i) * 2
                if idx + 1 >= len(frames): break
                env = min(1.0, i / (0.02 * rate), (2 * rate - i) / (0.05 * rate))
                v = 0.07 * env * (math.sin(2 * math.pi * 440 * i / rate) + math.sin(2 * math.pi * 480 * i / rate)) / 2
                cur = struct.unpack('<h', frames[idx:idx+2])[0]
                frames[idx:idx+2] = struct.pack('<h', max(-32768, min(32767, cur + int(v * 32767))))
o = wave.open(out, 'wb'); o.setnchannels(1); o.setsampwidth(2); o.setframerate(rate); o.writeframes(bytes(frames)); o.close()
print('mixed', out, rate)
`;
const track = path.join(outDir, "voiceover.wav");
const r = spawnSync("python3", ["-c", mixPy, JSON.stringify(scenes.map((s) => ({ wav: s.wav, start: s.start, lead: s.lead, sfx: s.sfx }))), String(TOTAL), track], { encoding: "utf8" });
if (r.status !== 0) throw new Error(r.stderr);
console.log(r.stdout.trim());

/* --------------------------------------------------------------- mux --- */

const ffmpeg = execFileSync("python3", ["-c", "import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())"]).toString().trim();
const final = path.join(outDir, sb.output || "demo.mp4");
execFileSync(ffmpeg, ["-y", "-v", "error", "-i", silent, "-i", track, "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-shortest", "-movflags", "+faststart", final], { stdio: "inherit" });
console.log("wrote", final);
