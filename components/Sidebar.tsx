"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ListChecks,
  Menu,
  Plus,
  ReceiptText,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

const items = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/app/purchases", label: "Purchases", icon: ListChecks },
  { href: "/app/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ email, plan }: { email: string; plan: "free" | "pro" }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <MobileBar onOpen={() => setOpen(true)} />

      {open ? (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-ink/20 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-sidebar p-4 transition-transform md:sticky md:top-0 md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between md:mb-8">
          <Link href="/app" className="flex items-center gap-2.5 px-2">
            <ReceiptMark />
            <span className="font-display text-base font-semibold tracking-tight">
              Purchase Ping
            </span>
          </Link>
          <button
            aria-label="Close menu"
            className="rounded-md p-1 text-muted hover:text-ink md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {items.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-100",
                  active
                    ? "bg-accent text-white"
                    : "text-ink hover:bg-border/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link href="/app/purchases/new" className="btn-primary mt-5 w-full">
          <Plus className="h-4 w-4" /> Add Purchase
        </Link>

        <div className="mt-auto rounded-[6px] border border-border bg-surface/80 p-3">
          <div className="truncate font-mono text-[10px] uppercase tracking-widest text-muted">
            {email}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide",
                plan === "pro"
                  ? "bg-accent-50 text-accent"
                  : "bg-bg text-muted",
              )}
            >
              {plan}
            </span>
            <form action="/auth/signout" method="post">
              <button className="font-mono text-[10px] text-muted transition-colors hover:text-ink">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
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

function MobileBar({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-sidebar/95 px-4 backdrop-blur md:hidden">
      <button
        aria-label="Open menu"
        onClick={onOpen}
        className="-ml-1 rounded-md p-2 text-ink hover:bg-border/60"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Link href="/app" className="flex items-center gap-2">
        <ReceiptMark />
        <span className="font-display text-sm font-semibold">Purchase Ping</span>
      </Link>
      <Link
        href="/app/purchases/new"
        aria-label="Add purchase"
        className="rounded-md p-2 text-accent hover:bg-accent-50"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </div>
  );
}
