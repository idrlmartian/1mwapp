import path from "node:path";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import MailComposer from "nodemailer/lib/mail-composer";
// Email clients do not resolve CSS custom properties, so the brand fill has to
// be a literal hex in the markup — but it is interpolated from the one source
// rather than typed out, which is how it drifted to its own copy before.
import { SIGNAL_FILL } from "@/app/lib/brand";

/*
  Transport: Amazon SES v2, ap-south-1 (same region as the box).

  Why this and not Google Workspace SMTP, which the plan originally chose: that
  route needed an App Password on sales@ (a founder-blocking, 2FA-gated manual
  step, capped at 500/day) or an IP-allowlisted relay approval. SES needs
  neither — the EC2 instance role can already call ses:SendEmail, so there are
  NO credentials to provision, rotate or leak. The account has production
  access (50,000/day, 14/sec) and BOUNCE+COMPLAINT suppression enabled.

  The DNS cost was three Easy DKIM CNAMEs plus adding `include:amazonses.com`
  to the ONE existing SPF record. MX was not touched, so the founder's Google
  Workspace mail is unaffected, and google._domainkey still signs it.

  nodemailer is still a dependency but is no longer a transport — it is only
  MailComposer, building the MIME blob. That is required, not stylistic:
  SESv2's `Content.Simple` has no attachment field, so the CID-embedded logo
  can only ship via `Content.Raw`.
*/

export const SALES_EMAIL = "sales@1martianway.com";

const SES_REGION = process.env.SES_REGION ?? process.env.AWS_REGION ?? "ap-south-1";

// undefined (not "") when unset — SES rejects an empty configuration set name.
const CONFIG_SET = process.env.SES_CONFIGURATION_SET || undefined;

/** Envelope sender. SES verifies the whole domain, so any @1martianway.com works. */
const FROM_EMAIL =
    process.env.MAIL_FROM_EMAIL ?? process.env.SMTP_FROM_EMAIL ?? SALES_EMAIL;

/*
  A LAPTOP MUST NOT BE ABLE TO MAIL A REAL PERSON.

  Credentials come from the ambient AWS chain rather than explicit SMTP_* env,
  so the old "no env var, no send" safety does not exist — an `aws sso login`
  session on a laptop is enough to send for real.

  THIS USED TO KEY ON NODE_ENV AND FAILED OPEN. `next start` sets
  NODE_ENV=production for ANY production build, including one running on a dev
  machine, so "production means it is the server" is false exactly where it
  matters. Running the built app locally to check the signup flow would mail
  whatever address was typed, to a real inbox, from the real domain — the
  waitlist confirmation, complete with verify and unsubscribe links.

  Found the same defect in 1mw-id's copy of this file, where it actually fired:
  testing the sign-in flow on a laptop attempted a live send and only failed
  because that machine had no SES credentials loaded.

  MAIL_ENABLED is set by the deployment and by nothing else, so it fails CLOSED:
  a new environment that forgets it prints instead of sending, which is the
  failure everyone notices immediately and nobody has to apologise for.

  MAIL_ALLOW_DEV_SEND is kept as an alias so an existing env file that sets it
  keeps working rather than silently going quiet on the next deploy.
*/
const CAN_SEND =
    process.env.MAIL_ENABLED === "1" || process.env.MAIL_ALLOW_DEV_SEND === "1";

let client: SESv2Client | undefined;
function getClient() {
    client ??= new SESv2Client({ region: SES_REGION });
    return client;
}

export const emailEnabled = () => CAN_SEND;

type Attachment = { filename: string; path: string; cid: string };

/**
 * Compose a MIME message and hand it to SES as a raw blob.
 *
 * Resolves without sending outside production unless MAIL_ALLOW_DEV_SEND=1.
 * Throws on a genuine send failure so callers can record it — every caller
 * fires this AFTER responding to the user, so a throw never costs a signup.
 */
export async function sendMail(msg: {
    to: string;
    subject: string;
    text: string;
    html?: string;
    from?: string;
    replyTo?: string;
    headers?: Record<string, string>;
    attachments?: Attachment[];
}) {
    const raw = await new MailComposer({
        from: msg.from ?? FROM_EMAIL,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html,
        replyTo: msg.replyTo,
        headers: msg.headers,
        attachments: msg.attachments?.map((a) => ({ ...a, contentDisposition: "inline" as const })),
    })
        .compile()
        .build();

    if (!CAN_SEND) {
        console.warn(
            `[email] not production — skipping send of "${msg.subject}" to ${msg.to}. ` +
                "Set MAIL_ALLOW_DEV_SEND=1 to send for real."
        );
        return;
    }

    // Destination is passed explicitly rather than left to SES's header
    // parsing. FromEmailAddress deliberately is NOT — supplying it overrides
    // the MIME From and would drop the "1 Martian Way" display name.
    //
    // ConfigurationSetName buys per-domain bounce/complaint metrics. It does
    // NOT isolate risk: SES enforcement (throttle/pause) is account-level, and
    // this account also carries droneracingindia.com's live transactional
    // mail. So the value is seeing a bounce problem building here before AWS
    // acts on it and takes IDRL's mail down with ours.
    await getClient().send(
        new SendEmailCommand({
            Destination: { ToAddresses: [msg.to] },
            ConfigurationSetName: CONFIG_SET,
            Content: { Raw: { Data: new Uint8Array(raw) } },
        })
    );
}

/** Strip CR/LF so nothing reaching a header can inject one. */
export const headerSafe = (s: string) => s.replace(/[\r\n]+/g, " ").trim().slice(0, 200);

/** Escape before interpolating anything user-controlled into HTML. */
export const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
    );

const MARK_PNG = path.join(process.cwd(), "public/assets/img/1mw-mark-240.png");
const CID = "mark@1martianway";

/*
  The logo in email.

  - NEVER inline SVG: no mail client supports it.
  - NEVER background-image: Outlook desktop (Word engine) ignores it.
  - NEVER a hosted https URL: blocked by default for unknown senders, which a
    first-contact confirmation always is.

  So: a CID-embedded PNG, on a td with bgcolor set to the brand red. Three
  details make it robust — width/height as HTML ATTRIBUTES (Outlook ignores CSS
  dimensions), a 240px source shown at 120px for retina, and the red baked into
  the PNG so Gmail's forced dark-mode inversion cannot turn a white glyph
  invisible. If images are stripped entirely, the alt text still sits on brand red.
*/
function shell(bodyHtml: string, preheader: string) {
    return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>1 Martian Way</title>
<style>
  @media (max-width:600px){ .container{width:100%!important} .px{padding-left:24px!important;padding-right:24px!important} }
</style>
</head>
<body style="margin:0;padding:0;background:#F4F4F5;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F4F5;">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:14px;overflow:hidden;">
      <tr>
        <td align="center" bgcolor="${SIGNAL_FILL}" style="background-color:${SIGNAL_FILL};padding:28px 24px;">
          <img src="cid:${CID}" width="96" height="96" alt="1 Martian Way"
               style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;border-radius:16px;" />
        </td>
      </tr>
      <tr><td class="px" style="padding:36px 44px 40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181B;">
        ${bodyHtml}
      </td></tr>
      <tr><td class="px" style="padding:0 44px 34px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#71717A;">
        <div style="height:1px;background:#E4E4E7;margin-bottom:18px;"></div>
        1 Martian Way Industries Pvt. Ltd.<br>
        502 Satya Sadan, Bhimani Street, Matunga East, Mumbai 400 019, India
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

/*
  Copy per product, rather than one product's words baked into a shared
  function.

  The previous version was Magy-only — "early access", "we'll email you the
  moment the first build is ready" — and stayed that way after the 2026-08-26
  cutover made /magy a 404 and toowl the only public product. Anyone who had
  signed up would have been sent a promise about a product they could no longer
  reach. Hardcoding toowl in its place would re-rot the same way the moment the
  held-back products come back, so the copy is keyed instead.

  toowl needs genuinely different words, not a find-and-replace: it is FREE AND
  SHIPPED, so there is nothing to wait for. Promising to mail someone "when the
  first build is ready" about software they can install in one command reads as
  a mistake. The ask is release notes, and the CTA is the install — the same
  reasoning that removed the toowl waitlist block from /toowl in 6f9247a.
*/
type ProductKey = "toowl" | "magy" | "mos";

const PRODUCT_COPY: Record<ProductKey, {
    subject: string;
    preheader: string;
    lead: string;      // HTML — may carry <strong>
    leadText: string;  // the same sentence, for the text/plain part
    promise: string;
}> = {
    toowl: {
        subject: "You're on the toowl list",
        preheader: "Release notes for toowl, and nothing else.",
        lead: "Thanks for signing up for <strong>toowl</strong> — a GPU-fast terminal and a tmux-style remote client in one binary, with Claude on the Perch.",
        leadText:
            "Thanks for signing up for toowl — a GPU-fast terminal and a tmux-style\nremote client in one binary, with Claude on the Perch.",
        promise:
            "It is free and shipped, so there is nothing to wait for: install it with <code style=\"font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;\">curl -fsSL toowl.dev/install.sh | sh</code>. We'll email you when a new version lands — and nothing else.",
    },
    magy: {
        subject: "You're on the Magy early-access list",
        preheader: "You're on the Magy early-access list.",
        lead: "Thanks for signing up for early access to <strong>Magy</strong> — the 3D embodied multi-agent platform.",
        leadText:
            "Thanks for signing up for early access to Magy — the 3D embodied\nmulti-agent platform.",
        promise:
            "Infinite agents. Infinite worlds. Any work. We'll email you the moment the first build is ready — and nothing else.",
    },
    mos: {
        subject: "You're on the MOS early-access list",
        preheader: "You're on the MOS early-access list.",
        lead: "Thanks for signing up for early access to <strong>MOS</strong> — the robotics simulator with a mathematically guaranteed zero sim-to-sim gap.",
        leadText:
            "Thanks for signing up for early access to MOS — the robotics simulator\nwith a mathematically guaranteed zero sim-to-sim gap.",
        promise: "We'll email you the moment the first build is ready — and nothing else.",
    },
};

/** Unknown or absent product falls back to the one that is actually public. */
const copyFor = (product?: string) =>
    PRODUCT_COPY[(product ?? "") as ProductKey] ?? PRODUCT_COPY.toowl;

export function confirmationEmail(opts: {
    verifyUrl: string;
    unsubscribeUrl: string;
    product?: string;
}) {
    const c = copyFor(opts.product);
    const html = shell(
        `<h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;letter-spacing:-0.5px;color:#18181B;">You're on the list.</h1>
     <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#3F3F46;">
       ${c.lead}
     </p>
     <p style="margin:0 0 26px;font-size:16px;line-height:1.65;color:#3F3F46;">
       ${c.promise}
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
       <td bgcolor="${SIGNAL_FILL}" style="background-color:${SIGNAL_FILL};border-radius:8px;">
         <a href="${opts.verifyUrl}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">Confirm you're in &rarr;</a>
       </td>
     </tr></table>
     <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#71717A;">
       Confirming is optional but helps us keep the list clean — unconfirmed addresses don't receive updates.
     </p>`,
        c.preheader
    );

    const text = `You're on the list.

${c.leadText}

${c.promise.replace(/<[^>]+>/g, "")}

Confirm you're in: ${opts.verifyUrl}

Unsubscribe: ${opts.unsubscribeUrl}

1 Martian Way Industries Pvt. Ltd.
502 Satya Sadan, Bhimani Street, Matunga East, Mumbai 400 019, India`;

    return { subject: c.subject, html, text };
}

export async function sendConfirmation(
    to: string,
    verifyUrl: string,
    unsubscribeUrl: string,
    product?: string
) {
    const { subject, html, text } = confirmationEmail({ verifyUrl, unsubscribeUrl, product });
    await sendMail({
        from: `1 Martian Way <${FROM_EMAIL}>`,
        to,
        subject,
        html,
        text,
        attachments: [{ filename: "1mw-mark.png", path: MARK_PNG, cid: CID }],
        headers: {
            // Required by Gmail/Yahoo bulk-sender rules, and a direct
            // spam-complaint reducer.
            "List-Unsubscribe": `<${unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
    });
}

/** Last-resort capture: if both Postgres and the disk fail, mail it to sales@. */
export async function sendSignupFallback(payload: Record<string, unknown>) {
    await sendMail({
        from: `1MW Waitlist <${FROM_EMAIL}>`,
        to: process.env.NOTIFY_EMAIL ?? SALES_EMAIL,
        subject: headerSafe(`[ACTION] Waitlist signup could not be stored: ${payload.email}`),
        text:
            "Postgres AND the disk fallback both failed. This address exists ONLY in this email.\n\n" +
            JSON.stringify(payload, null, 2),
    });
}
