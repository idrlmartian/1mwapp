/*
  Analytics events.

  Umami, self-hosted on the same box, against the Postgres that is already
  there. Plausible was the closer call but needs ClickHouse as a second stateful
  service — too much machinery for a site that will do a few thousand visits in
  launch week. Vercel Analytics is out by definition now.

  The script is served FIRST-PARTY through a next.config.js rewrite, because
  ad-blockers match on hostname and path; skipping that is why self-hosted
  analytics routinely reports half of reality.

  No cookies, no cross-site identifier, so no consent banner — which holds only
  as long as nothing here starts setting one.

  Six events, deliberately. The single metric that matters this week is email
  signups; everything else is there to explain that number, not to decorate it.
*/

type Props = Record<string, string | number | boolean | undefined>;

declare global {
    interface Window {
        umami?: { track: (event: string, data?: Props) => void };
    }
}

function track(event: string, props?: Props) {
    if (typeof window === "undefined") return;
    try {
        window.umami?.track(event, props);
    } catch {
        /* analytics must never break a signup */
    }
}

/** The form scrolled into view. Denominator for the funnel. */
export const signupView = (source: string) => track("signup_view", { source });

/** Submit pressed — before we know whether it worked. */
export const signupSubmit = (source: string) => track("signup_submit", { source });

/** Accepted. `duplicate` separates new addresses from repeat submissions. */
export const signupSuccess = (source: string, duplicate: boolean) =>
    track("signup_success", { source, duplicate });

/** Rejected, with the reason — this is what tells us if the form is broken. */
export const signupError = (source: string, reason: string) =>
    track("signup_error", { source, reason });

/** The strongest pre-signup intent signal we have. */
export const videoPlay = () => track("magy_video_play");

/** Header CTA, to see whether the sticky button is doing work. */
export const navCtaClick = (page: string) => track("nav_cta_click", { page });
