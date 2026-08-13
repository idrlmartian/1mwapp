"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  A one-tap install command.

  The whole row is the button, with a copy icon as the visible affordance —
  the pattern Bun, Vercel, shadcn and Homebrew all converged on. Two reasons
  it beats an icon-only hit target: the thing a visitor's eye lands on is the
  command, so that is what their pointer goes to, and on a phone a 16px icon
  is under the 44px minimum where the whole row is comfortably over it.

  ONE <button>, not a button inside a button. The icon is a <span>; nesting
  interactive elements is invalid HTML and gives screen readers two controls
  where there is one action.

  The `$` is deliberately outside the copied string. It is a prompt marker, not
  part of the command, and pasting it produces "command not found: $".
*/

type Props = {
    /** Exactly what lands on the clipboard. No prompt marker. */
    command: string;
    className?: string;
};

export default function CopyCommand({ command, className = "" }: Props) {
    const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

    const copy = useCallback(async () => {
        /*
          navigator.clipboard is undefined outside a secure context — which
          includes plain-http staging and some in-app browsers. The textarea
          fallback is deprecated but still works everywhere, and silently doing
          nothing would be worse than a deprecation.
        */
        let ok = false;
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(command);
                ok = true;
            } else {
                const ta = document.createElement("textarea");
                ta.value = command;
                ta.setAttribute("readonly", "");
                // Off-screen rather than display:none — a hidden element cannot
                // be selected, so the copy would silently do nothing.
                ta.style.cssText = "position:fixed;top:-9999px;opacity:0";
                document.body.appendChild(ta);
                ta.select();
                ok = document.execCommand("copy");
                document.body.removeChild(ta);
            }
        } catch {
            ok = false;
        }

        setState(ok ? "copied" : "failed");
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setState("idle"), 2000);
    }, [command]);

    const copied = state === "copied";

    return (
        <div className={className}>
            <button
                type="button"
                onClick={copy}
                aria-label={`Copy install command: ${command}`}
                className={`border-line bg-sunk hover:border-line-hi group inline-flex w-fit max-w-full items-center gap-3 rounded-[var(--radius-md)] border py-3 pl-3.5 pr-2.5 text-left font-mono text-[12.5px] transition-colors ${
                    copied ? "border-good" : ""
                }`}
            >
                <span className="text-good shrink-0 select-none" aria-hidden>
                    $
                </span>
                <code className="text-fg-muted group-hover:text-fg min-w-0 flex-1 overflow-x-auto whitespace-nowrap transition-colors">
                    {command}
                </code>

                {/* Both icons occupy the same cell so the row cannot resize on
                    state change — a button that jumps as you click it reads as
                    a glitch rather than as feedback. */}
                <span
                    className={`grid size-7 shrink-0 place-items-center rounded-[var(--radius-sm)] transition-colors ${
                        copied ? "text-good" : "text-fg-dim group-hover:text-fg group-hover:bg-[var(--color-line)]"
                    }`}
                    aria-hidden
                >
                    <span className="col-start-1 row-start-1" style={{ opacity: copied ? 0 : 1 }}>
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="12" height="12" rx="2" />
                            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                        </svg>
                    </span>
                    <span className="col-start-1 row-start-1" style={{ opacity: copied ? 1 : 0 }}>
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                        </svg>
                    </span>
                </span>
            </button>

            {/*
              Announced, not just shown. The icon swap is invisible to a screen
              reader, so without this the button would appear to do nothing.
              role=status is polite — it waits rather than interrupting.
            */}
            <p
                role="status"
                aria-live="polite"
                className={`mt-1.5 h-4 text-[11.5px] transition-opacity ${
                    state === "idle" ? "opacity-0" : "opacity-100"
                } ${state === "failed" ? "text-warn" : "text-good"}`}
            >
                {state === "copied" && "Copied to clipboard"}
                {state === "failed" && "Couldn't copy — select the command and copy manually"}
            </p>
        </div>
    );
}
