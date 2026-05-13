"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
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
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-7 w-7 flex-col items-center justify-center gap-0.5 rounded-md bg-accent px-1.5">
            {[100, 70, 85, 55].map((w, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full bg-white/80"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <a href="/" className="font-display text-base font-semibold tracking-tight hover:text-accent transition-colors">
            Purchase Ping
          </a>
        </div>

        <div className="card p-7">
          {/* Receipt-style header */}
          <div className="mb-6 border-b border-dashed border-border pb-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Sign in
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              We&apos;ll email you a magic link. No password required.
            </p>
          </div>

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
