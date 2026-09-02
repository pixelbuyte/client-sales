"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BrandMark } from "@/components/BrandMark";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const notAuthorized = searchParams.get("error") === "not_authorized";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/app`,
      },
    });
    if (error) {
      setError(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <BrandMark />
          <a href="/" className="font-display text-base font-semibold tracking-tight hover:text-accent transition-colors">
            Admin
          </a>
        </div>

        <div className="card p-7">
          <div className="mb-6 border-b border-dashed border-border pb-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Sign in
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Tracker access
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              We&apos;ll email you a magic link. No password required.
            </p>
          </div>

          {notAuthorized ? (
            <div className="mb-4 rounded-[4px] border border-accent-200 bg-accent-50 p-3 text-sm text-accent">
              That account isn&apos;t authorized for the tracker.
            </div>
          ) : null}

          {status === "sent" ? (
            <div className="rounded-[4px] border border-success/20 bg-success-50 p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-success">
                Link sent
              </div>
              <p className="mt-1 text-sm text-ink">
                Check <span className="font-medium">{email}</span> for your
                sign-in link.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary w-full"
              >
                {status === "sending" ? "Sending…" : "Send magic link"}
              </button>
              {error ? (
                <p className="font-mono text-xs text-accent">{error}</p>
              ) : null}
            </form>
          )}
        </div>

        <p className="mt-5 text-center font-mono text-[10px] text-muted">
          <a href="/" className="transition-colors hover:text-ink">
            ← Back to homepage
          </a>
        </p>
      </div>
    </main>
  );
}
