"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const OPTIONS = [
    {
        value: "light",
        label: "Light",
        icon: (
            <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
            </>
        ),
    },
    {
        value: "dark",
        label: "Dark",
        icon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
    },
    {
        value: "system",
        label: "System",
        icon: (
            <>
                <rect x="2" y="4" width="20" height="13" rx="2" />
                <path d="M8 21h8" />
            </>
        ),
    },
] as const;

/** Three-way theme control, matching the Mission Deck spec (light / dark / system). */
export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // The server cannot know the visitor's theme, so rendering the pressed state
    // before hydration guarantees a mismatch. Render the control unpressed until
    // mounted rather than returning null, which would shift the header layout.
    useEffect(() => setMounted(true), []);

    return (
        <div
            role="group"
            aria-label="Theme"
            className="border-line bg-sunk flex rounded-[var(--radius-capsule)] border p-0.5"
        >
            {OPTIONS.map((o) => {
                const active = mounted && theme === o.value;
                return (
                    <button
                        key={o.value}
                        type="button"
                        onClick={() => setTheme(o.value)}
                        aria-label={o.label}
                        aria-pressed={active}
                        className={`grid h-[26px] w-7 place-items-center rounded-[var(--radius-capsule)] transition-colors ${
                            active
                                ? "bg-solid text-fg shadow-[var(--shadow-deck)]"
                                : "text-fg-dim hover:text-fg"
                        }`}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden
                        >
                            {o.icon}
                        </svg>
                    </button>
                );
            })}
        </div>
    );
}
