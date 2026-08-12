import { AGENTS } from "@/app/lib/constants";

/*
  The Magy workspace, drawn.

  Hand-authored SVG, no raster — the technique taken from toowl's website, whose
  entire site ships ZERO images: every "screenshot" is markup. Three things that
  buys, all of which a PNG loses:

    · it re-themes. Every fill reads a CSS variable, so this follows the theme
      switch. A screenshot is stuck in whichever theme it was shot in.
    · it costs no request and no bytes beyond the markup, and cannot shift
      layout while it decodes.
    · it never goes stale against a capture session that hasn't happened.

  THE LIMIT, and it is a hard one: this is legitimate only for UI surfaces. A
  terminal, a roster, a diff — rectangles and text, which SVG reproduces
  faithfully. It may NEVER stand in for MagyVerse. A stylised 3D office would be
  the first untrue thing on a page whose demo section promises "a real capture,
  driven live — no mockups". Those slots stay visibly empty until shot.
*/

export default function MagyWorkspace() {
    return (
        <svg
            viewBox="0 0 720 452"
            role="img"
            aria-label="The Magy workspace: an agent roster on the left, a composer holding a typed request, a delegation trace from Kai to Zara, and pull request 482 approved and security-cleared."
        >
            <defs>
                <linearGradient id="mw-glow" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue)" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="var(--color-warm)" stopOpacity="0.10" />
                </linearGradient>
                <filter id="mw-drop" x="-6%" y="-6%" width="112%" height="124%">
                    <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000" floodOpacity="0.34" />
                </filter>
            </defs>

            <rect width="720" height="452" rx="16" fill="url(#mw-glow)" />

            <g filter="url(#mw-drop)">
                <rect x="30" y="28" width="660" height="396" rx="13" fill="var(--color-solid)" stroke="var(--color-line-hi)" />
                <path d="M30 41a13 13 0 0 1 13-13h634a13 13 0 0 1 13 13v20H30z" fill="var(--color-sunk)" />
                <circle cx="50" cy="45" r="5" fill="var(--color-red)" />
                <circle cx="66" cy="45" r="5" fill="var(--color-warn)" />
                <circle cx="82" cy="45" r="5" fill="var(--color-good)" />
                <text x="360" y="49" textAnchor="middle" fontSize="10.5" fontWeight="600" fill="var(--color-fg-dim)">
                    magyverse — office
                </text>
                <line x1="30" y1="61" x2="690" y2="61" stroke="var(--color-line)" />

                {/* roster */}
                <rect x="30" y="61" width="176" height="363" fill="var(--color-sunk)" />
                <line x1="206" y1="61" x2="206" y2="424" stroke="var(--color-line)" />
                <text x="48" y="84" className="font-mono" fontSize="8.5" fontWeight="700" letterSpacing="1.4" fill="var(--color-fg-dim)">
                    ROSTER
                </text>
                <g fontSize="10.5">
                    {AGENTS.map((a, i) => {
                        const y = 106 + i * 24;
                        const busy = a.id === "zara";
                        return (
                            <g key={a.id}>
                                {busy && <rect x="40" y={y - 10} width="156" height="24" rx="6" fill="var(--color-blue-soft)" />}
                                <circle cx="52" cy={y} r="3.5" fill={`var(--color-${a.token})`} />
                                <text x="64" y={y + 4} fill="var(--color-fg)" fontWeight={busy ? 700 : 600}>
                                    {a.name}
                                </text>
                                <text x="106" y={y + 4} fill="var(--color-fg-dim)">
                                    {a.role}
                                </text>
                                {busy && (
                                    <text x="150" y={y + 4} className="font-mono" fontSize="7.5" fontWeight="700" fill="var(--color-blue)">
                                        BUSY
                                    </text>
                                )}
                                {/* Marks Argus as not-yet-seeded inside the picture too, so the
                                    mockup cannot quietly outrun the runtime. */}
                                {a.pending && (
                                    <>
                                        <rect x="146" y={y - 7} width="38" height="13" rx="6.5" fill="var(--color-warm-soft)" />
                                        <text x="165" y={y + 2.5} textAnchor="middle" className="font-mono" fontSize="6.5" fontWeight="700" fill="var(--color-warm)">
                                            SOON
                                        </text>
                                    </>
                                )}
                            </g>
                        );
                    })}
                </g>
                <line x1="44" y1="308" x2="192" y2="308" stroke="var(--color-line)" />
                <text x="48" y="326" fontSize="10" fill="var(--color-fg-dim)">
                    + hire another
                </text>

                {/* composer */}
                <text x="228" y="84" className="font-mono" fontSize="8.5" fontWeight="700" letterSpacing="1.4" fill="var(--color-fg-dim)">
                    COMPOSER
                </text>
                <rect x="228" y="94" width="440" height="42" rx="8" fill="var(--color-sunk)" stroke="var(--color-line-hi)" />
                <text x="244" y="120" className="font-mono" fontSize="10.5" fill="var(--color-fg)">
                    extract the parser into its own crate
                </text>
                <rect x="640" y="104" width="2" height="22" fill="var(--color-red)" />

                {/* trace */}
                <text x="228" y="166" className="font-mono" fontSize="8.5" fontWeight="700" letterSpacing="1.4" fill="var(--color-fg-dim)">
                    TRACE
                </text>
                <g fontSize="10">
                    <circle cx="238" cy="188" r="3" fill="var(--color-juno)" />
                    <text x="252" y="191.5" fill="var(--color-fg-muted)">
                        <tspan fill="var(--color-fg)" fontWeight="700">Juno</tspan> wrote the spec — 4 acceptance criteria
                    </text>
                    <circle cx="238" cy="212" r="3" fill="var(--color-kai)" />
                    <text x="252" y="215.5" fill="var(--color-fg-muted)">
                        <tspan fill="var(--color-fg)" fontWeight="700">Kai</tspan> walked over and delegated to Zara
                    </text>
                    <circle cx="238" cy="236" r="3" fill="var(--color-zara)" />
                    <text x="252" y="239.5" fill="var(--color-fg-muted)">
                        <tspan fill="var(--color-fg)" fontWeight="700">Zara</tspan> acquired worktree{" "}
                        <tspan className="font-mono" fill="var(--color-blue)">feat/parser-extract</tspan>
                    </text>
                    <circle cx="238" cy="260" r="3" fill="var(--color-luna)" />
                    <text x="252" y="263.5" fill="var(--color-fg-muted)">
                        <tspan fill="var(--color-fg)" fontWeight="700">Luna</tspan> reviewed — tests green
                    </text>
                </g>
                {/* The delegation arc, drawn between the two agents it belongs to —
                    the same gesture the world draws in 3D. */}
                <path d="M238 216 C 214 224, 214 228, 238 233" fill="none" stroke="var(--color-kai)" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.85" />

                {/* pull request */}
                <rect x="228" y="290" width="440" height="94" rx="9" fill="var(--color-sunk)" stroke="var(--color-good)" />
                <circle cx="248" cy="312" r="4.5" fill="var(--color-good)" />
                <text x="262" y="316" fontSize="11.5" fontWeight="700" fill="var(--color-fg)">
                    PR #482 — extract parser into magy-parse
                </text>
                <text x="262" y="334" fontSize="10" fill="var(--color-fg-muted)">
                    +412 −188 · 9 files · opened by Zara
                </text>
                <rect x="262" y="346" width="70" height="18" rx="9" fill="var(--color-good)" opacity="0.16" />
                <text x="297" y="358" textAnchor="middle" className="font-mono" fontSize="8" fontWeight="700" fill="var(--color-good)">
                    APPROVED
                </text>
                <rect x="340" y="346" width="58" height="18" rx="9" fill="var(--color-warm)" opacity="0.18" />
                <text x="369" y="358" textAnchor="middle" className="font-mono" fontSize="8" fontWeight="700" fill="var(--color-warm)">
                    MERGING
                </text>
            </g>
        </svg>
    );
}
