/*
  The t-owl — toowl's mascot, ported from that site's Owl.astro.

  Geometry, colours and animation timings are copied verbatim. The Catppuccin
  palette is hard-coded on purpose and must NOT be remapped onto our tokens:
  this is another product's identity, and a mascot recoloured to match its host
  stops being that product's mascot. Same rule the small owl mark on this page
  already follows.

  Design notes from the source, kept because they explain the shapes:
    · "toowl" ≈ "t-owl" — the mascot writes itself.
    · Body gradient matches the app-icon bolt (#fab387 → #f9e2af → #fab387) so
      the brand mark and the mascot are visually related.
    · Belly patch and irises are Catppuccin lavender (#b4befe) — the same colour
      as the terminal's cursor.
    · Kawaii proportions: eyes ~40% of the head, head ~55% of total height. The
      big-head/small-body silhouette reads as "cute" pre-cognitively.

  ── ONE DELIBERATE FIX ────────────────────────────────────────────────────
  The chest bolt is wrapped in TWO groups here, where the source uses one.

  The source puts `transform="translate(85, 156) scale(0.12)"` as an ATTRIBUTE
  on the same <g> that its `owl-bolt-pulse` animation targets. A CSS `transform`
  overrides the SVG transform attribute rather than composing with it — so the
  instant that animation runs, the placement is thrown away and the bolt renders
  at scale 1: x 70→186, y 30→226 of a 200×240 viewBox, a giant bolt across the
  whole owl. It is live on toowl.karmasteels.com right now.

  Splitting it fixes that with no change to the artwork: the outer <g> holds the
  placement, the inner one takes the animation, and neither can clobber the
  other. The same trick would fix it upstream.
*/

export default function ToowlOwl({ size = 260 }: { size?: number }) {
    return (
        <svg
            className="toowl-owl block overflow-visible"
            width={size}
            height={size * 1.2}
            viewBox="0 0 200 240"
            role="img"
            aria-label="An adorable owl mascot for toowl, holding a tiny lightning-bolt feather"
        >
            <defs>
                <linearGradient id="towl-body" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fab387" />
                    <stop offset="50%" stopColor="#f9e2af" />
                    <stop offset="100%" stopColor="#fab387" />
                </linearGradient>
                <linearGradient id="towl-wing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f38ba8" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#fab387" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="towl-glow" cx="0.5" cy="0.55" r="0.6">
                    <stop offset="0%" stopColor="#f9e2af" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#f9e2af" stopOpacity="0" />
                </radialGradient>
            </defs>

            <ellipse cx="100" cy="125" rx="95" ry="105" fill="url(#towl-glow)" />

            <g className="owl-float">
                {/* ear tufts */}
                <path d="M52 56 L62 30 L74 60 Z" fill="url(#towl-body)" stroke="#f5c2e7" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M126 60 L138 30 L148 56 Z" fill="url(#towl-body)" stroke="#f5c2e7" strokeWidth="2.5" strokeLinejoin="round" />

                {/* body + head as one egg — owls have no neck */}
                <ellipse cx="100" cy="135" rx="76" ry="85" fill="url(#towl-body)" stroke="#f5c2e7" strokeWidth="2.5" />

                {/* wings */}
                <path d="M32 130 Q22 165 40 195 Q52 175 50 140 Q42 122 32 130 Z" fill="url(#towl-wing)" stroke="#f5c2e7" strokeWidth="2" strokeLinejoin="round" />
                <path d="M168 130 Q178 165 160 195 Q148 175 150 140 Q158 122 168 130 Z" fill="url(#towl-wing)" stroke="#f5c2e7" strokeWidth="2" strokeLinejoin="round" />

                {/* belly patch */}
                <ellipse cx="100" cy="175" rx="38" ry="34" fill="#b4befe" fillOpacity="0.45" />

                {/* chest bolt — placement outside, animation inside. See the header. */}
                <g transform="translate(85, 156) scale(0.12)">
                    <g className="owl-bolt">
                        <path
                            d="M154 30 L70 142 L120 142 L102 226 L186 114 L136 114 Z"
                            fill="url(#towl-body)"
                            stroke="#f5c2e7"
                            strokeWidth="6"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    </g>
                </g>

                {/* facial disk */}
                <ellipse cx="100" cy="100" rx="64" ry="48" fill="#fff7e6" fillOpacity="0.55" />

                <g className="owl-eyes">
                    <circle cx="74" cy="100" r="26" fill="#1e1e2e" />
                    <circle cx="74" cy="100" r="23" fill="#ffffff" />
                    <circle cx="76" cy="102" r="14" fill="#b4befe" />
                    <circle cx="77" cy="103" r="8" fill="#1e1e2e" />
                    <circle cx="81" cy="98" r="3.5" fill="#ffffff" />
                    <circle cx="73" cy="106" r="1.5" fill="#ffffff" opacity="0.7" />

                    <circle cx="126" cy="100" r="26" fill="#1e1e2e" />
                    <circle cx="126" cy="100" r="23" fill="#ffffff" />
                    <circle cx="124" cy="102" r="14" fill="#b4befe" />
                    <circle cx="123" cy="103" r="8" fill="#1e1e2e" />
                    <circle cx="127" cy="98" r="3.5" fill="#ffffff" />
                    <circle cx="119" cy="106" r="1.5" fill="#ffffff" opacity="0.7" />
                </g>

                {/* beak */}
                <path d="M100 128 L92 138 L100 148 L108 138 Z" fill="#f9e2af" stroke="#f5c2e7" strokeWidth="2" strokeLinejoin="round" />

                {/* cheeks */}
                <ellipse cx="58" cy="128" rx="8" ry="5" fill="#f38ba8" fillOpacity="0.55" />
                <ellipse cx="142" cy="128" rx="8" ry="5" fill="#f38ba8" fillOpacity="0.55" />

                {/* feet — three talons each */}
                <g stroke="#f5c2e7" strokeWidth="2.5" strokeLinecap="round" fill="none">
                    <path d="M82 218 L78 230" />
                    <path d="M88 219 L88 232" />
                    <path d="M94 218 L98 230" />
                    <path d="M106 218 L102 230" />
                    <path d="M112 219 L112 232" />
                    <path d="M118 218 L122 230" />
                </g>
            </g>
        </svg>
    );
}
