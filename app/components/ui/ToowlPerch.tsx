/*
  toowl with the Claude Feather open on the Perch.

  Adapted from the toowl site's own ClaudeMockup.astro, whose header comment is
  the whole argument: "Pure SVG — no images, no PNGs to maintain. Scales
  infinitely." That site ships ZERO raster files; every screenshot on it is
  markup. This is the same idea rebuilt on our tokens rather than Catppuccin's,
  so it follows the theme switch instead of being stuck in toowl's dark palette.

  Honest because it is UI chrome: a terminal is rectangles and monospaced text,
  which SVG reproduces faithfully. The caption says "Illustration", because
  that is what this is — the SHAPE is real, the picture is drawn.

  Geometry follows the toowl Chrome Spec, which is measured against the Rust
  source. Two corrections it forced (2026-08-26):

    · The Perch is on the RIGHT. `PerchSideSpec::Auto` is toowl's default and
      `perch_side_auto_is_always_right` asserts it resolves right for every
      tab-bar placement — `left` is an explicit opt-out. This drew it on the
      left, which no default user has ever seen.
    · macOS draws the tab strip INSIDE a transparent full-size titlebar, inset
      past the traffic lights: one row, not two. The old drawing stacked a
      titlebar above a separate strip — the Linux/Windows geometry — while
      drawing macOS traffic lights, so it matched neither platform.
*/

const SESSIONS: [string, string, boolean][] = [
    ["v1.1 release prep", "resumed · just now", true],
    ["fix CSS gradient bug", "2 hours ago", false],
    ["owl mascot SVG", "yesterday", false],
    ["plugin host design", "2 days ago", false],
    ["vt parser DA1/DSR", "3 days ago", false],
];

export default function ToowlPerch() {
    return (
        <svg
            viewBox="0 0 720 452"
            role="img"
            aria-label="toowl with the Claude Feather open on the Perch at the right, showing recent sessions beside a terminal resuming a Claude conversation."
        >
            <defs>
                <linearGradient id="tp-glow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-nova)" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="var(--color-warm)" stopOpacity="0.12" />
                </linearGradient>
                <filter id="tp-drop" x="-6%" y="-6%" width="112%" height="124%">
                    <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity="0.4" />
                </filter>
                {/* The Perch is flush to the window's right edge, so the window
                    radius has to cut its corners or it squares them off. */}
                <clipPath id="tp-win">
                    <rect x="34" y="30" width="652" height="392" rx="13" />
                </clipPath>
            </defs>

            <rect width="720" height="452" rx="16" fill="url(#tp-glow)" />

            <g filter="url(#tp-drop)">
                <rect x="34" y="30" width="652" height="392" rx="13" fill="var(--color-solid)" stroke="var(--color-line-hi)" />

                <g clipPath="url(#tp-win)">
                    {/* macOS full-size titlebar — traffic lights and pills share it */}
                    <rect x="34" y="30" width="652" height="34" fill="var(--color-sunk)" />
                    <line x1="34" y1="64" x2="686" y2="64" stroke="var(--color-line)" />
                    <circle cx="54" cy="47" r="5" fill="var(--color-red)" />
                    <circle cx="70" cy="47" r="5" fill="var(--color-warn)" />
                    <circle cx="86" cy="47" r="5" fill="var(--color-good)" />

                    {/* active pill — accent ring, status dot, close × only here */}
                    <rect x="104" y="37" width="150" height="20" rx="6" fill="var(--color-line)" stroke="var(--color-warm)" />
                    <circle cx="116" cy="47" r="3" fill="var(--color-good)" />
                    <text x="126" y="50.5" fontSize="9.5" fontWeight="600" fill="var(--color-fg)">
                        zsh — ~/projects/toowl
                    </text>
                    <text x="240" y="50.5" fontSize="9.5" fontWeight="700" fill="var(--color-fg-dim)">
                        ×
                    </text>

                    {/* resting pill */}
                    <rect x="260" y="37" width="96" height="20" rx="6" fill="var(--color-panel)" />
                    <circle cx="272" cy="47" r="3" fill="var(--color-fg-dim)" />
                    <text x="282" y="50.5" fontSize="9.5" fill="var(--color-fg-muted)">
                        ssh idrl
                    </text>

                    <text x="368" y="51" fontSize="12" fontWeight="700" fill="var(--color-fg-dim)">
                        +
                    </text>

                    {/* right cluster: screenshot + hamburger */}
                    <rect x="628" y="37" width="20" height="20" rx="5" fill="var(--color-panel)" />
                    <rect x="634" y="43" width="8" height="7" rx="1.5" fill="none" stroke="var(--color-fg-dim)" strokeWidth="1.2" />
                    <rect x="654" y="37" width="20" height="20" rx="5" fill="var(--color-panel)" />
                    <rect x="658" y="43" width="12" height="1.8" rx="0.9" fill="var(--color-fg-dim)" />
                    <rect x="658" y="47" width="12" height="1.8" rx="0.9" fill="var(--color-fg-dim)" />
                    <rect x="658" y="51" width="12" height="1.8" rx="0.9" fill="var(--color-fg-dim)" />

                    {/* ── the Perch, on the RIGHT ───────────────────────── */}
                    <rect x="490" y="64" width="196" height="358" fill="var(--color-sunk)" />
                    <line x1="490" y1="64" x2="490" y2="422" stroke="var(--color-line)" />
                    <path d="M512 82 l-8 11 h5 l-2 9 8-11 h-5 z" fill="var(--color-warm)" />
                    <text x="526" y="91" fontSize="11" fontWeight="700" fill="var(--color-warm)">
                        Claude Code
                    </text>
                    <rect x="626" y="78" width="46" height="16" rx="5" fill="var(--color-line)" />
                    <text x="649" y="89.5" textAnchor="middle" fontSize="8.5" fontWeight="600" fill="var(--color-fg)">
                        + New
                    </text>
                    <line x1="504" y1="102" x2="616" y2="102" stroke="var(--color-warm)" />

                    {SESSIONS.map(([title, sub, active], i) => {
                        const y = 126 + i * 40;
                        return (
                            <g key={title}>
                                {active && (
                                    <>
                                        <rect x="498" y={y - 14} width="176" height="34" rx="7" fill="var(--color-warm-soft)" />
                                        <rect x="498" y={y - 14} width="2.5" height="34" rx="1" fill="var(--color-warm)" />
                                    </>
                                )}
                                <circle cx="512" cy={y - 1} r="3" fill={active ? "var(--color-good)" : "var(--color-fg-dim)"} />
                                <text x="524" y={y + 2} fontSize="10" fontWeight={active ? 700 : 500} fill={active ? "var(--color-fg)" : "var(--color-fg-muted)"}>
                                    {title}
                                </text>
                                <text x="524" y={y + 14} fontSize="8.5" fill="var(--color-fg-dim)">
                                    {sub}
                                </text>
                            </g>
                        );
                    })}

                    {/* ── terminal pane, now the left and larger half ───── */}
                    <rect x="52" y="80" width="118" height="17" rx="8.5" fill="var(--color-good)" opacity="0.16" />
                    <circle cx="64" cy="88.5" r="3" fill="var(--color-good)" />
                    <text x="74" y="92" fontSize="9" fontWeight="600" fill="var(--color-good)">
                        Session resumed
                    </text>

                    <g className="font-mono" fontSize="9.5">
                        <text x="52" y="122" fill="var(--color-fg)">$ claude --resume</text>
                        <circle cx="56" cy="141" r="3" fill="var(--color-nova)" />
                        <text x="66" y="144" fill="var(--color-fg)">Resumed session: v1.1 release prep</text>
                        <text x="52" y="160" fill="var(--color-fg-dim)">Reading 3 files, 247 messages of context...</text>
                        <text x="52" y="186" fill="var(--color-warm)" fontWeight="700">Claude:</text>
                        <text x="52" y="202" fill="var(--color-fg-muted)">Looking at the landing page work from</text>
                        <text x="52" y="218" fill="var(--color-fg-muted)">yesterday. The owl mascot SVG looks great.</text>
                        <text x="52" y="234" fill="var(--color-fg-muted)">Three things left before v1.1 ships:</text>
                        <text x="70" y="256" fill="var(--color-blue)">1.</text>
                        <text x="88" y="256" fill="var(--color-fg-muted)">Bump Cargo.toml to 1.1.0</text>
                        <text x="70" y="272" fill="var(--color-blue)">2.</text>
                        <text x="88" y="272" fill="var(--color-fg-muted)">Rasterize og-image.svg → png</text>
                        <text x="70" y="288" fill="var(--color-blue)">3.</text>
                        <text x="88" y="288" fill="var(--color-fg-muted)">Wire up the release checklist</text>
                        <text x="52" y="312" fill="var(--color-fg-muted)">Want me to start on #1?</text>
                        <text x="52" y="338" fill="var(--color-fg)">$ yes</text>
                        <rect x="82" y="329" width="6" height="12" fill="var(--color-warm)" />
                    </g>
                </g>
            </g>
        </svg>
    );
}
