"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Menu, Plus, Upload, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/BrandMark";

const items = [
  { href: "/app", label: "Tracker", icon: LayoutDashboard, exact: true },
  { href: "/app/shops", label: "Shops", icon: LayoutDashboard },
  { href: "/app/shops/import", label: "Import CSV", icon: Upload },
];

export function Sidebar({ email }: { email: string }) {
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
            <BrandMark />
            <span className="font-display text-base font-semibold tracking-tight">
              Tracker
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
                  active ? "bg-accent text-white" : "text-ink hover:bg-border/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <Link href="/app/shops/new" className="btn-primary mt-5 w-full">
          <Plus className="h-4 w-4" /> Add shop
        </Link>

        <div className="mt-auto rounded-[6px] border border-border bg-surface/80 p-3">
          <div className="truncate font-mono text-[10px] uppercase tracking-widest text-muted">
            {email}
          </div>
          <form action="/auth/signout" method="post" className="mt-2">
            <button className="font-mono text-[10px] text-muted transition-colors hover:text-ink">
              Sign out
            </button>
          </form>
        </div>
      </aside>
    </>
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
        <BrandMark />
        <span className="font-display text-sm font-semibold">Tracker</span>
      </Link>
      <Link
        href="/app/shops/new"
        aria-label="Add shop"
        className="rounded-md p-2 text-accent hover:bg-accent-50"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </div>
  );
}
