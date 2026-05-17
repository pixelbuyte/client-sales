import type { Metadata } from "next";
import Link from "next/link";
import { ProductThumb } from "@/components/ProductThumb";
import {
  MerchantSenseShowcase,
  ReceiptDecodeShowcase,
} from "@/components/ReceiptDecodeShowcase";
import { Bell, Check, LineChart, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Purchase Ping — Never miss another return window",
  description:
    "The personal dashboard for everything you buy online. Track return windows, warranties, and spending in one place. Email reminders before deadlines close.",
  openGraph: {
    title: "Purchase Ping — Never miss another return window",
    description:
      "Track return windows, warranties, and spending for everything you buy online. Email reminders before deadlines close.",
    url: "/",
    siteName: "Purchase Ping",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Purchase Ping — Never miss another return window",
    description:
      "Track return windows, warranties, and spending for everything you buy online.",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <ReceiptMark />
          <span className="font-display text-base font-semibold tracking-tight">
            Purchase Ping
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <a
            href="#how"
            className="hidden text-muted transition-colors hover:text-ink sm:inline"
          >
            How it works
          </a>
          <a
            href="#pricing"
            className="text-muted transition-colors hover:text-ink"
          >
            Pricing
          </a>
          <Link href="/login" className="btn-secondary py-1.5 text-xs">
            Sign in
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-16 text-center md:pt-20">
        <div className="hero-1 mb-6 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-50 px-3 py-1 text-xs font-medium text-accent">
          <Sparkles className="h-3 w-3" />
          New: AI receipt scan on Pro
        </div>
        <h1 className="hero-2 font-display text-5xl font-semibold leading-[1.1] tracking-tight md:text-[62px]">
          The $200 return you forgot about?
          <br />
          <em className="not-italic text-accent">Never again.</em>
        </h1>
        <p className="hero-3 mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Purchase Ping is the personal dashboard for everything you buy online.
          Track return windows, warranties, and spending in one place — and get
          an email{" "}
          <strong className="font-medium text-ink">3 days before</strong> a
          return deadline closes.
        </p>
        <div className="hero-4 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className="btn-primary px-6 py-3 text-base">
            Start free — no card required
          </Link>
          <a
            href="#pricing"
            className="text-sm text-muted transition-colors hover:text-ink"
          >
            See pricing →
          </a>
        </div>
        <p className="hero-5 mt-4 text-xs text-muted">
          One missed return pays for the year of Pro.
        </p>
      </section>

      {/* Hero mock dashboard */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="card overflow-hidden p-2">
          <div className="rounded-[4px] border border-border bg-bg p-8">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Dashboard
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <MockStat
                label="Returns closing soon"
                value="2"
                sub="next 14 days"
                rows={[
                  ["AirPods Pro", "Apple", "3d", "red", "/products/airpods-pro.png"],
                  ["Nike Air Max", "Nike", "11d", "gray", "/products/nike-air-max.png"],
                ]}
              />
              <MockStat
                label="Warranties ending"
                value="1"
                sub="next 30 days"
                rows={[["Organic blueberries", "Whole Foods", "22d", "amber", "/products/whole-foods.png"]]}
              />
              <MockStat
                label="This month"
                value="$1,427.99"
                sub="6 purchases"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-2 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            What it does
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <h2 className="mb-2 text-center font-display text-3xl font-semibold tracking-tight">
          Three things, done well.
        </h2>
        <p className="mb-12 text-center text-sm text-muted">
          Not a budget app. Not a bank sync. Just the receipts stuff.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <Feature
            icon={<Bell className="h-5 w-5" />}
            title="Returns, before they close"
            body="Add a purchase, set the return deadline (we suggest 30 days). We email you 3 days before it ends. No more 'ugh, I missed it by a day.'"
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Warranties on a timeline"
            body="See every warranty expiration in one view. When something breaks, the receipt is two clicks away — not lost in your inbox from 2023."
          />
          <Feature
            icon={<LineChart className="h-5 w-5" />}
            title="Spending without judgment"
            body="Six-month chart, category breakdown, searchable history. Not a budgeting app — just clarity about what you bought."
          />
        </div>
      </section>


      {/* Receipt decode — visual, not walls of text */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Smart parsing
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card overflow-hidden p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              We speak receipt.
            </h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
              Codes in → clarity out
            </p>
            <ReceiptDecodeShowcase />
          </div>
          <div className="card overflow-hidden p-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              We know where you shopped.
            </h2>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
              Grocery · retail · restaurant · gas
            </p>
            <MerchantSenseShowcase />
          </div>
        </div>
      </section>

      {/* AI scan feature */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="card grid grid-cols-1 gap-8 overflow-hidden p-8 md:grid-cols-2 md:p-12">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-xs font-medium text-accent">
              <Sparkles className="h-3 w-3" />
              Pro feature
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight">
              Snap a receipt, fields fill themselves
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Upload a photo or PDF and the merchant, item, price, and date
              prefill from the image. Review, save, done — typing optional.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Works on photos, screenshots, and PDFs
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Powered by Claude vision — same AI behind this site&apos;s code
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Your receipts never train any model
              </li>
            </ul>
          </div>

          {/* Scan card with animated scan line */}
          <div className="relative overflow-hidden rounded-md border border-border bg-bg p-6">
            {/* Animated scan line */}
            <div className="scan-line absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="flex items-center justify-between text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-mono uppercase tracking-widest">
                  Receipt
                </span>
              </div>
              <span className="rounded-full bg-accent-50 px-2 py-0.5 font-medium text-accent">
                Scanning…
              </span>
            </div>
            <div className="mt-5 space-y-2.5 text-sm">
              <FillRow label="Item" value="AirPods Pro (2nd gen)" />
              <FillRow label="Merchant" value="Apple" />
              <FillRow label="Price" value="$249.00" />
              <FillRow label="Date" value="Dec 15, 2024" />
            </div>

            {/* Decorative receipt bottom serration */}
            <div className="mt-6 flex gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full bg-border"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
            Pricing
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Start free. Upgrade when reminders pay for themselves.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            <PricingCard
              name="Free"
              price="$0"
              cadence="forever"
              tagline="Up to 10 purchases. Perfect to try it."
              cta="Start free"
              features={[
                "Up to 10 purchases",
                "Dashboard with deadlines",
                "Search & history",
                "Receipt uploads",
              ]}
            />
            <PricingCard
              name="Pro"
              price="$9"
              cadence="per month"
              tagline="One missed return pays for the year."
              cta="Start free, upgrade later"
              highlighted
              features={[
                "Unlimited purchases",
                "Email reminders before windows close",
                "AI receipt scan (auto-fill from image)",
                "CSV import & export",
                "Receipt storage up to 2GB",
              ]}
              note="Annual is $79 (save 26%). Cancel anytime."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-center font-display text-3xl font-semibold tracking-tight">
          FAQ
        </h2>
        <div className="mt-10 space-y-3">
          <Faq
            q="Is this a budgeting app?"
            a="No. There's no budget setting, no goals, no shame messages. It tracks what you bought and when things expire. The chart is for awareness, not enforcement."
          />
          <Faq
            q="Do you sync with my bank or Gmail?"
            a="No, by design. You enter purchases manually or import a CSV. On Pro, you can also snap a photo of the receipt and we auto-fill the fields. We never read your email or connect to your bank."
          />
          <Faq
            q="What happens if I miss the email reminder?"
            a="We email 3 days before the deadline (Pro). The deadline also shows on your dashboard with a colored countdown chip — red ≤3 days, amber ≤7 days, gray otherwise. You can't miss it unless you really try."
          />
          <Faq
            q="What if I cancel?"
            a="Your data stays. You drop to the free 10-purchase view. Upgrade again any time and everything is right where you left it."
          />
          <Faq
            q="Where does my data live?"
            a="Supabase (US-East). Receipts are stored in a private bucket and only ever accessed by your account. See the privacy page for details."
          />
          <Faq
            q="Can I import from a spreadsheet?"
            a="Yes. CSV import is on every plan. The page shows a sample format and accepts header synonyms (item, name, store, vendor, date, etc.)."
          />
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-muted">
          <Link href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-ink">
            Terms
          </Link>
        </div>
        <div className="mt-2 font-mono text-[11px] text-muted/60">
          © {new Date().getFullYear()} Purchase Ping
        </div>
      </footer>
    </main>
  );
}

function ReceiptMark() {
  return (
    <div className="flex h-7 w-7 flex-col items-center justify-center gap-0.5 rounded-md bg-accent px-1.5">
      {[100, 70, 85, 55].map((w, i) => (
        <div
          key={i}
          className="h-[2px] rounded-full bg-white/80"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-6 transition-shadow duration-200 hover:shadow-card-hover">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-50 text-accent">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  cadence,
  tagline,
  features,
  cta,
  highlighted,
  note,
}: {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  note?: string;
}) {
  return (
    <div
      className={
        highlighted
          ? "card overflow-hidden border-accent/40 ring-1 ring-accent/20"
          : "card overflow-hidden"
      }
    >
      {/* Receipt-style header strip for Pro */}
      {highlighted && (
        <div className="flex items-center justify-between border-b border-dashed border-accent/25 bg-accent-50/60 px-6 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
            {name} Plan
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 w-1 rounded-full bg-accent/40"
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-6">
        {!highlighted && (
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
            {name}
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-4xl font-medium tracking-tight">
            {price}
          </span>
          <span className="text-sm text-muted">{cadence}</span>
        </div>
        <p className="mt-2 text-sm text-muted">{tagline}</p>

        <ul className="mt-5 space-y-2.5 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/login"
          className={highlighted ? "btn-primary mt-6 w-full" : "btn-secondary mt-6 w-full"}
        >
          {cta}
        </Link>
        {note ? (
          <p className="mt-3 text-center font-mono text-[10px] text-muted">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group card px-5 py-4">
      <summary className="cursor-pointer list-none text-sm font-medium transition-colors group-open:text-accent">
        <span className="mr-2 font-mono text-accent">+</span>
        {q}
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
    </details>
  );
}

function MockStat({
  label,
  value,
  sub,
  rows,
}: {
  label: string;
  value: string;
  sub: string;
  rows?: Array<[string, string, string, "red" | "amber" | "gray", string?]>;
}) {
  const tones = {
    red: "bg-accent-50 text-accent",
    amber: "bg-warning-50 text-warning",
    gray: "bg-bg text-muted",
  };
  return (
    <div className="rounded-[4px] border border-border bg-surface p-4">
      <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </div>
      <div className="mt-2 font-mono text-2xl font-medium tracking-tight">
        {value}
      </div>
      <div className="font-mono text-[10px] text-muted">{sub}</div>
      {rows ? (
        <div className="mt-3 space-y-1.5 border-t border-border pt-3">
          {rows.map(([title, sub, days, tone, image]) => (
            <div key={title} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex min-w-0 items-center gap-2">
                <ProductThumb
                  imageUrl={image ?? null}
                  name={title}
                  merchant={sub}
                  size="sm"
                />
                <div className="min-w-0">
                  <div className="truncate">{title}</div>
                  <div className="truncate font-mono text-[10px] text-muted">
                    {sub}
                  </div>
                </div>
              </div>
              <span
                className={
                  "rounded-full px-2 py-0.5 font-mono text-[10px] font-medium " +
                  tones[tone]
                }
              >
                {days} left
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FillRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[4px] border border-border bg-surface px-3 py-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
