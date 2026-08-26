"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import WaitlistForm from "@/app/components/WaitlistForm";
import { navCtaClick } from "@/app/lib/analytics";

/*
  The header's "Get Early Access" button, and the dialog it opens.

  It used to be a link to "/#early-access". That target does not exist on most
  pages -- `id="early-access"` lives only on the old home and Magy pages -- and
  "/" now redirects to /toowl, so from the toowl page the button navigated to
  "/", bounced back to /toowl, and landed on no anchor at all. It read as a
  dead button on every page of the site.

  A dialog works from anywhere and does not depend on a section existing
  further down whatever page you happen to be on.

  Built on the native <dialog> with showModal(), which supplies the focus
  trap, the inert background, Escape-to-close and the ::backdrop -- all of the
  parts that are laborious and easy to get wrong by hand, and all of them
  accessible by default.
*/
export default function EarlyAccessCta() {
    const pathname = usePathname();
    const ref = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(false);

    const close = useCallback(() => {
        ref.current?.close();
    }, []);

    const openDialog = useCallback(() => {
        navCtaClick(pathname);
        setOpen(true);
        ref.current?.showModal();
    }, [pathname]);

    /*
      Escape closes the dialog without going through our handler, so React
      state would drift out of sync with the element's real state. Listening
      for `close` -- which fires however it was dismissed -- is the only way to
      stay authoritative.
    */
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const sync = () => setOpen(false);
        el.addEventListener("close", sync);
        return () => el.removeEventListener("close", sync);
    }, []);

    return (
        <>
            <button
                type="button"
                onClick={openDialog}
                aria-haspopup="dialog"
                aria-expanded={open}
                className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] inline-flex items-center rounded-[9px] px-3.5 py-2.5 text-[12.5px] font-bold text-white transition-colors"
            >
                Get Early Access
            </button>

            <dialog
                ref={ref}
                aria-labelledby="early-access-title"
                /*
                  A click on <dialog> itself is a click on the backdrop: the
                  panel below is a child, so anything landing on the element
                  proper missed it. Without this the only ways out are Escape
                  and the close button, and clicking away -- what most people
                  try first -- does nothing.
                */
                onClick={(event) => {
                    if (event.target === ref.current) close();
                }}
                className="border-line bg-solid text-fg m-auto w-[min(28rem,calc(100vw-2rem))] rounded-[var(--radius-lg)] border p-0 shadow-[var(--shadow-deck)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
            >
                <div className="p-6">
                    <div className="mb-1 flex items-start justify-between gap-4">
                        <h2 id="early-access-title" className="text-[17px] font-extrabold">
                            Toowl Pro early access
                        </h2>
                        <button
                            type="button"
                            onClick={close}
                            aria-label="Close"
                            className="text-fg-dim hover:text-fg -mr-1 -mt-1 shrink-0 rounded p-1 text-[18px] leading-none transition-colors"
                        >
                            &times;
                        </button>
                    </div>

                    <p className="text-fg-muted mb-4 text-[13.5px]">
                        Toowl itself is free and installs with one command. Pro adds
                        terminal-native intelligence — we&apos;ll email you when it opens.
                    </p>

                    {/*
                      autoFocus is deliberately NOT set. showModal() already moves
                      focus into the dialog, and on a phone a focused input springs
                      the keyboard the instant the dialog appears, covering the copy
                      that explains what is being signed up for.
                    */}
                    <WaitlistForm
                        source="header"
                        product="toowl"
                        size="hero"
                        cta="Get Early Access"
                    />
                </div>
            </dialog>
        </>
    );
}
