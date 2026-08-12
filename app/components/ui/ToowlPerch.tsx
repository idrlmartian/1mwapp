/*
  toowl with the Claude Feather open on the Perch.

  Adapted from the toowl site's own ClaudeMockup.astro, whose header comment is
  the whole argument: "Pure SVG — no images, no PNGs to maintain. Scales
  infinitely." That site ships ZERO raster files; every screenshot on it is
  markup. This is the same idea rebuilt on our tokens rather than Catppuccin's,
  so it follows the theme switch instead of being stuck in toowl's dark palette.

  Honest because it is UI chrome: a terminal is rectangles and monospaced text,
  which SVG reproduces faithfully. The caption on the section says "real UI",
  and that is a claim about the SHAPE — the Perch, the session list, the crash
  banner, the palette — all of which ship in v1.0.
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
            aria-label="toowl with the Claude Code sidebar open on the Perch, showing recent sessions beside a terminal resuming a Claude conversation."
        >
            <defs>
                <linearGradient id="tp-glow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-nova)" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="var(--color-warm)" stopOpacity="0.12" />
                </linearGradient>
                <filter id="tp-drop" x="-6%" y="-6%" width="112%" height="124%">
                    <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity="0.4" />
                </filter>
            </defs>

            <rect width="720" height="452" rx="16" fill="url(#tp-glow)" />

            <g filter="url(#tp-drop)">
                <rect x="34" y="30" width="652" height="392" rx="13" fill="var(--color-solid)" stroke="var(--color-line-hi)" />
                <path d="M34 43a13 13 0 0 1 13-13h626a13 13 0 0 1 13 13v20H34z" fill="var(--color-sunk)" />
                <circle cx="54" cy="47" r="5" fill="var(--color-red)" />
                <circle cx="70" cy="47" r="5" fill="var(--color-warn)" />
                <circle cx="86" cy="47" r="5" fill="var(--color-good)" />
                <text x="360" y="51" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--color-fg-dim)">
                    ~/projects/toowl
                </text>

                {/* tab strip */}
                <rect x="34" y="63" width="652" height="26" fill="var(--color-sunk)" />
                <rect x="50" y="68" width="132" height="16" rx="8" fill="var(--color-line)" />
                <circle cx="62" cy="76" r="3" fill="var(--color-good)" />
                <text x="72" y="79.5" fontSize="9.5" fontWeight="600" fill="var(--color-fg)">
                    zsh — toowl
                </text>
                <text x="196" y="79.5" fontSize="11" fontWeight="700" fill="var(--color-fg-dim)">
                    +
                </text>

                {/* the Perch */}
                <rect x="34" y="89" width="196" height="333" fill="var(--color-sunk)" />
                <line x1="230" y1="89" x2="230" y2="422" stroke="var(--color-line)" />
                <path d="M56 104 l-8 11 h5 l-2 9 8-11 h-5 z" fill="var(--color-warm)" />
                <text x="70" y="113" fontSize="11" fontWeight="700" fill="var(--color-fg)">
                    Claude Code
                </text>

                {SESSIONS.map(([title, sub, active], i) => {
                    const y = 136 + i * 40;
                    return (
                        <g key={title}>
                            {active && (
                                <>
                                    <rect x="44" y={y - 14} width="176" height="34" rx="7" fill="var(--color-warm-soft)" />
                                    <rect x="44" y={y - 14} width="2.5" height="34" rx="1" fill="var(--color-warm)" />
                                </>
                            )}
                            <circle cx="58" cy={y - 1} r="3" fill={active ? "var(--color-good)" : "var(--color-fg-dim)"} />
                            <text x="70" y={y + 2} fontSize="10" fontWeight={active ? 700 : 500} fill={active ? "var(--color-fg)" : "var(--color-fg-muted)"}>
                                {title}
                            </text>
                            <text x="70" y={y + 14} fontSize="8.5" fill="var(--color-fg-dim)">
                                {sub}
                            </text>
                        </g>
                    );
                })}

                {/* the resumed session */}
                <rect x="248" y="102" width="118" height="17" rx="8.5" fill="var(--color-good)" opacity="0.16" />
                <circle cx="260" cy="110.5" r="3" fill="var(--color-good)" />
                <text x="270" y="114" fontSize="9" fontWeight="600" fill="var(--color-good)">
                    Session resumed
                </text>

                <g className="font-mono" fontSize="9.5">
                    <text x="248" y="142" fill="var(--color-fg)">$ claude --resume</text>
                    <circle cx="252" cy="161" r="3" fill="var(--color-nova)" />
                    <text x="262" y="164" fill="var(--color-fg)">Resumed session: v1.1 release prep</text>
                    <text x="248" y="180" fill="var(--color-fg-dim)">Reading 3 files, 247 messages of context...</text>
                    <text x="248" y="206" fill="var(--color-warm)" fontWeight="700">Claude:</text>
                    <text x="248" y="222" fill="var(--color-fg-muted)">Looking at the landing page work from yesterday.</text>
                    <text x="248" y="238" fill="var(--color-fg-muted)">The owl mascot SVG looks great. Three things</text>
                    <text x="248" y="254" fill="var(--color-fg-muted)">left before v1.1 ships:</text>
                    <text x="266" y="276" fill="var(--color-blue)">1.</text>
                    <text x="284" y="276" fill="var(--color-fg-muted)">Bump Cargo.toml to 1.1.0</text>
                    <text x="266" y="292" fill="var(--color-blue)">2.</text>
                    <text x="284" y="292" fill="var(--color-fg-muted)">Rasterize og-image.svg → png</text>
                    <text x="266" y="308" fill="var(--color-blue)">3.</text>
                    <text x="284" y="308" fill="var(--color-fg-muted)">Wire up the Pro waitlist form</text>
                    <text x="248" y="332" fill="var(--color-fg-muted)">Want me to start on #1?</text>
                    <text x="248" y="358" fill="var(--color-fg)">$ yes</text>
                    <rect x="278" y="349" width="6" height="12" fill="var(--color-warm)" />
                </g>
            </g>
        </svg>
    );
}
