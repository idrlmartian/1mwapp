"use client";

import { useEffect, useRef, useState } from "react";

/*
  The sticky "on this page" nav.

  Two changes from the plain anchor list it replaces:

    · it knows where you are. There was no active state at all, so on a page
      this long the nav told you what existed but never where you were in it.
    · the active pill is the SAME treatment as the header's current-page link —
      bg-blue-soft, blue text, a 38% inset ring, sitting in a bg-sunk track.
      Two navs on one screen disagreeing about what "you are here" looks like is
      a thing readers notice without being able to say why.

  Blue rather than the warm accent on purpose. Warm means "this is already
  true"; this is navigation state, which is what blue has always meant here.

  IntersectionObserver rather than a scroll handler: no listener on every frame,
  and the rootMargin does the work a scroll handler would need arithmetic for.
  -110px off the top clears the two stacked sticky bars (56px header + section
  nav); -65% off the bottom means a section only counts as current once it has
  actually reached the upper third, instead of the moment its first pixel shows.
*/

type Section = readonly [string, string];

export default function SectionNav({ sections }: { sections: readonly Section[] }) {
    const [active, setActive] = useState<string>(sections[0]?.[0] ?? "");
    // The <nav> is the overflow-x-auto element; the <ul> inside it does not scroll.
    const scroller = useRef<HTMLElement>(null);

    useEffect(() => {
        const seen = new Map<string, boolean>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const e of entries) seen.set(e.target.id, e.isIntersecting);
                // First in document order wins, so scrolling up doesn't leave a
                // lower section highlighted while an upper one is also on screen.
                const current = sections.find(([id]) => seen.get(id));
                if (current) setActive(current[0]);
            },
            { rootMargin: "-110px 0px -65% 0px" },
        );
        for (const [id] of sections) {
            const el = document.getElementById(id);
            if (el) io.observe(el);
        }
        return () => io.disconnect();
    }, [sections]);

    /*
      Keep the active pill in view on narrow screens, where the bar scrolls
      sideways.

      Done by setting scrollLeft by hand, NOT with scrollIntoView. scrollIntoView
      scrolls every scrollable ancestor including the WINDOW, so on first paint
      it dragged the whole page down to wherever this nav sat — hiding the hero,
      the wordmark and the headline. With `scroll-behavior: smooth` on <html> it
      even animated the theft.

      This touches one property on one element and cannot move the page.
    */
    useEffect(() => {
        const wrap = scroller.current;
        const el = wrap?.querySelector<HTMLElement>(`[data-id="${active}"]`);
        if (!wrap || !el) return;
        const pad = 12;
        const left = el.offsetLeft;
        const right = left + el.offsetWidth;
        if (left < wrap.scrollLeft) wrap.scrollLeft = left - pad;
        else if (right > wrap.scrollLeft + wrap.clientWidth) {
            wrap.scrollLeft = right - wrap.clientWidth + pad;
        }
    }, [active]);

    return (
        <nav
            ref={scroller}
            aria-label="On this page"
            className="border-line bg-canvas/85 sticky top-14 z-40 -mb-1 overflow-x-auto border-y backdrop-blur-xl"
        >
            <ul
                className="mx-auto flex max-w-[var(--container-page)] gap-1 px-[var(--container-pad)] py-2"
            >
                {sections.map(([id, label]) => {
                    const on = id === active;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                data-id={id}
                                aria-current={on ? "true" : undefined}
                                className={`block whitespace-nowrap rounded-[var(--radius-capsule)] px-2.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.13em] transition-colors ${
                                    on
                                        ? "bg-blue-soft text-blue font-bold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-blue)_38%,transparent)]"
                                        : "text-fg-muted hover:text-fg hover:bg-sunk"
                                }`}
                            >
                                {label}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
