"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSetupPayLink } from "@/app/app/shops/actions";

export function GeneratePayLinkButton({ shopId }: { shopId: string }) {
  const router = useRouter();
  const [state, setState] = useState<
    { status: "idle" } | { status: "loading" } | { status: "done"; url: string } | { status: "error"; message: string }
  >({ status: "idle" });

  async function onClick() {
    setState({ status: "loading" });
    try {
      const { payUrl } = await generateSetupPayLink(shopId);
      setState({ status: "done", url: payUrl });
      router.refresh();
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "Something went wrong." });
    }
  }

  if (state.status === "done") {
    return (
      <div className="rounded-md border border-border bg-bg p-3">
        <div className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Pay link — copy this and send it yourself after a verbal yes
        </div>
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
      </div>
    );
  }

  return (
    <div>
      <button type="button" className="btn-primary" disabled={state.status === "loading"} onClick={onClick}>
        {state.status === "loading" ? "Generating…" : "Generate pay link"}
      </button>
      {state.status === "error" ? <p className="mt-2 text-xs text-accent">{state.message}</p> : null}
    </div>
  );
}
