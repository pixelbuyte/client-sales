import Link from "next/link";
import { BUSINESS_NAME } from "@/lib/business";

export const metadata = { title: `Demo — ${BUSINESS_NAME}` };

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
        <Link href="/" className="text-xs text-muted hover:text-ink">
          ← Back
        </Link>

        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-accent">
          {BUSINESS_NAME} · 5-minute demo
        </div>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
          What actually gets recovered
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
          Two real situations that cost HVAC shops booked jobs every week — and what changes once
          this is running.
        </p>

        <div className="mt-10 space-y-6">
          <Scenario
            tag="Missed night call"
            time="9:14 PM"
            before={[
              { who: "Customer", text: "Calls the shop line — no heat, furnace won't kick on." },
              { who: "Shop", text: "Closed. Call rings out. No voicemail left." },
              { who: "Result", text: "Customer calls the next name in search results. Job gone." },
            ]}
            after={[
              { who: "Customer", text: "Calls the shop line — no heat, furnace won't kick on." },
              { who: "Recovery", text: "Missed call triggers an immediate text: “Sorry we missed you — is this urgent?”" },
              { who: "Customer", text: "Replies. Gets a callback window or an emergency dispatch, same night." },
              { who: "Result", text: "Job booked, not lost to the next search result." },
            ]}
          />

          <Scenario
            tag="Dead estimate"
            time="9 days later"
            before={[
              { who: "Shop", text: "Sends a written estimate for a system replacement." },
              { who: "Customer", text: "Goes quiet. No reply." },
              { who: "Result", text: "Estimate sits in a folder. Nobody follows up. Job goes cold." },
            ]}
            after={[
              { who: "Shop", text: "Sends a written estimate for a system replacement." },
              { who: "Recovery", text: "Day 3: automatic check-in — “Any questions on the quote?”" },
              { who: "Recovery", text: "Day 9: second touch if still no answer." },
              { who: "Result", text: "Estimate gets answered instead of forgotten." },
            ]}
          />
        </div>

        <div className="mt-12 card p-6">
          <h2 className="font-display text-base font-semibold">What this isn&apos;t</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Not a chatbot, not a new CRM, not a call center you have to manage. It&apos;s
            configured once for how your shop actually runs, then it just catches what your team
            can&apos;t get to.
          </p>
        </div>

        <div className="mt-8 rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-sm text-ink">
            Next step is a 15-minute call to see if it fits your shop.
          </p>
          <p className="mt-1 text-xs text-muted">
            No self-serve signup — reply to the email that sent you here.
          </p>
        </div>
      </div>
    </main>
  );
}

function Scenario({
  tag,
  time,
  before,
  after,
}: {
  tag: string;
  time: string;
  before: { who: string; text: string }[];
  after: { who: string; text: string }[];
}) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-dashed border-border px-5 py-3">
        <span className="font-display text-sm font-semibold">{tag}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">{time}</span>
      </div>
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Without this
          </div>
          <ul className="mt-3 space-y-2.5">
            {before.map((row, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{row.who}:</span>{" "}
                <span className="text-muted">{row.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-accent-50/40 p-5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-accent">
            With this running
          </div>
          <ul className="mt-3 space-y-2.5">
            {after.map((row, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{row.who}:</span>{" "}
                <span className="text-muted">{row.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
