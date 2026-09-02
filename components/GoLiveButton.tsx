"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { goLiveAction } from "@/app/app/shops/actions";

export function GoLiveButton({ shopId }: { shopId: string }) {
  const router = useRouter();
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "ok" }
    | { status: "fallback"; error: string; url: string }
  >({ status: "idle" });

  async function onClick() {
    setState({ status: "loading" });
    const result = await goLiveAction(shopId);
    if (result.ok) {
      setState({ status: "ok" });
    } else if (result.fallbackUrl) {
      setState({ status: "fallback", error: result.error, url: result.fallbackUrl });
    } else {
      setState({ status: "fallback", error: result.error, url: "" });
    }
    router.refresh();
  }

  if (state.status === "ok") {
    return <p className="text-sm text-success">Live — subscription started.</p>;
  }

  if (state.status === "fallback") {
    return (
      <div className="rounded-md border border-warning/30 bg-warning-50 p-3">
        <p className="text-sm text-ink">{state.error}</p>
        {state.url ? (
          <div className="mt-2 flex items-center gap-2">
            <input readOnly value={state.url} className="input flex-1 font-mono text-xs" onFocus={(e) => e.target.select()} />
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={() => navigator.clipboard.writeText(state.url)}
            >
              Copy
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button type="button" className="btn-primary" disabled={state.status === "loading"} onClick={onClick}>
      {state.status === "loading" ? "Starting…" : "Mark live (start $750/mo)"}
    </button>
  );
}
