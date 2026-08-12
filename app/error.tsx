"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        // The digest is the only handle on a production stack trace, so surface
        // it — both to the console and to the visitor, who may quote it to us.
        console.error("[page error]", error.digest ?? error.message);
    }, [error]);

    return (
        <div className="mx-auto grid min-h-[70svh] max-w-[52ch] place-content-center px-6 py-16 text-center">
            <p className="deck-label mb-4">Something broke</p>
            <h1 className="text-[clamp(1.5rem,3.6vw,2.1rem)] font-extrabold tracking-[-0.03em]">
                That page didn&apos;t load.
            </h1>
            <p className="text-fg-muted mt-3 text-[14px]">
                This is on us, not on you. Try again — and if it keeps happening, send us the
                reference below.
            </p>
            {error.digest && (
                <code className="border-line bg-sunk text-fg-dim mx-auto mt-4 rounded-[var(--radius-sm)] border px-2.5 py-1.5 font-mono text-[11.5px]">
                    {error.digest}
                </code>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                <button
                    type="button"
                    onClick={reset}
                    className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] rounded-[var(--radius-md)] px-5 py-3 text-sm font-bold text-white transition-colors"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="border-line-hi text-fg hover:bg-sunk rounded-[var(--radius-md)] border px-5 py-3 text-sm font-bold transition-colors"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
