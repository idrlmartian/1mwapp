import path from "node:path";
import nodemailer from "nodemailer";

/*
  Transport: nodemailer over Google Workspace.

  We deliberately did NOT add Resend/SendGrid/Postmark. SPF for 1martianway.com
  is `v=spf1 include:_spf.google.com ~all` and DKIM (google._domainkey) is
  already valid — so Google is the ONLY authorised sender. Adding a provider
  means SPF+DKIM DNS changes on the domain carrying the founder's live business
  email, during launch week, for zero deliverability gain.

  Note the box has a STATIC egress IP (13.205.218.213), which unlocks Google
  Workspace SMTP relay (smtp-relay.gmail.com:587, IP-allowlisted) at 10,000/day
  instead of smtp.gmail.com + App Password at 500/day. 500/day is a real ceiling
  for a Product Hunt spike — set the relay up before launch.

  Sending from the EC2 box's own MTA would FAIL SPF. With `~all` (softfail) that
  lands in spam rather than bouncing, which is the worst outcome because it looks
  like it worked.
*/

export const SALES_EMAIL = "sales@1martianway.com";

let transporter: nodemailer.Transporter | null | undefined;

function getTransport() {
    if (transporter !== undefined) return transporter;
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        transporter = null; // fail closed, loudly, at first use
        console.error("[email] SMTP env incomplete — transactional mail disabled");
        return transporter;
    }
    const port = Number(SMTP_PORT);
    transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465, // 587 uses STARTTLS, not implicit TLS
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });
    return transporter;
}

export const emailEnabled = () => getTransport() !== null;

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
        <td align="center" bgcolor="#D22222" style="background-color:#D22222;padding:28px 24px;">
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

export function confirmationEmail(opts: { verifyUrl: string; unsubscribeUrl: string }) {
    const html = shell(
        `<h1 style="margin:0 0 18px;font-size:26px;line-height:1.25;letter-spacing:-0.5px;color:#18181B;">You're on the list.</h1>
     <p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#3F3F46;">
       Thanks for signing up for early access to <strong>Magy</strong> — the world's first 3D embodied multi-agent platform.
     </p>
     <p style="margin:0 0 26px;font-size:16px;line-height:1.65;color:#3F3F46;">
       Infinite agents. Infinite worlds. Any work. We'll email you the moment the first build is ready — and nothing else.
     </p>
     <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
       <td bgcolor="#D22222" style="background-color:#D22222;border-radius:8px;">
         <a href="${opts.verifyUrl}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">Confirm you're in &rarr;</a>
       </td>
     </tr></table>
     <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#71717A;">
       Confirming is optional but helps us keep the list clean — unconfirmed addresses don't receive updates.
     </p>`,
        "You're on the Magy early-access list."
    );

    const text = `You're on the list.

Thanks for signing up for early access to Magy — the world's first 3D embodied
multi-agent platform. Infinite agents. Infinite worlds. Any work.

We'll email you the moment the first build is ready, and nothing else.

Confirm you're in: ${opts.verifyUrl}

Unsubscribe: ${opts.unsubscribeUrl}

1 Martian Way Industries Pvt. Ltd.
502 Satya Sadan, Bhimani Street, Matunga East, Mumbai 400 019, India`;

    return { subject: "You're on the Magy early-access list", html, text };
}

export async function sendConfirmation(to: string, verifyUrl: string, unsubscribeUrl: string) {
    const t = getTransport();
    if (!t) throw new Error("smtp_unconfigured");
    const { subject, html, text } = confirmationEmail({ verifyUrl, unsubscribeUrl });
    await t.sendMail({
        from: `1 Martian Way <${process.env.SMTP_FROM_EMAIL ?? SALES_EMAIL}>`,
        to,
        subject,
        html,
        text,
        attachments: [
            { filename: "1mw-mark.png", path: MARK_PNG, cid: CID, contentDisposition: "inline" },
        ],
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
    const t = getTransport();
    if (!t) throw new Error("smtp_unconfigured");
    await t.sendMail({
        from: `1MW Waitlist <${process.env.SMTP_FROM_EMAIL ?? SALES_EMAIL}>`,
        to: process.env.NOTIFY_EMAIL ?? SALES_EMAIL,
        subject: headerSafe(`[ACTION] Waitlist signup could not be stored: ${payload.email}`),
        text:
            "Postgres AND the disk fallback both failed. This address exists ONLY in this email.\n\n" +
            JSON.stringify(payload, null, 2),
    });
}
