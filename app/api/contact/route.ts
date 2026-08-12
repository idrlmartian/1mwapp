import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sql } from "@/app/lib/db";
import { escapeHtml, headerSafe, SALES_EMAIL } from "@/app/lib/email";
import { clientIp, rateLimit } from "@/app/lib/rate-limit";
import { hashIp, originAllowed, validateEmail, verifyFormToken } from "@/app/lib/waitlist";

/*
  Rewritten. The previous version had three live defects:

  1. HTML INJECTION INTO THE FOUNDER'S INBOX. `${name}` and `${message}` were
     interpolated raw into the `html` body, so anyone on the internet could send
     sales@1martianway.com arbitrary markup and links that appeared to originate
     from company infrastructure. That is a phishing primitive aimed at the
     person who reads sales mail.
  2. HEADER INJECTION via `${name}` in the subject line.
  3. OPEN RELAY: no origin check, no rate limit, no honeypot, no captcha — and
     no caller anywhere in the app, so nobody would have noticed it being abused.

  Also fixed: replyTo now points at the submitter (previously replying to a lead
  replied to yourself), and a missing SMTP config fails closed with 503 rather
  than throwing a 500 that leaks stack context.
*/

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 8192;

const TOPICS = new Set([
    "magy", "press", "licensing", "mos", "toowl", "idrl", "other",
]);

export async function POST(req: Request) {
    if (!originAllowed(req.headers)) {
        return NextResponse.json({ error: "Bad origin" }, { status: 403 });
    }
    if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) {
        return NextResponse.json({ error: "Too large" }, { status: 413 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
        console.error("[contact] SMTP env incomplete");
        return NextResponse.json({ error: "Contact is temporarily unavailable" }, { status: 503 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }

    const ipHash = hashIp(clientIp(req.headers));

    if (typeof body.company === "string" && body.company.trim() !== "") {
        return NextResponse.json({ message: "Sent" }, { status: 200 }); // honeypot
    }
    if (!verifyFormToken(body.t)) {
        return NextResponse.json({ message: "Sent" }, { status: 200 });
    }

    const limited = rateLimit(`c:${ipHash}`, { capacity: 5, refillPerSec: 5 / 3600 });
    if (!limited.ok) {
        return NextResponse.json(
            { error: "Too many messages. Try again later." },
            { status: 429, headers: { "retry-after": String(limited.retryAfter) } }
        );
    }

    const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
    const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";
    const topicRaw = typeof body.topic === "string" ? body.topic : "other";
    const topic = TOPICS.has(topicRaw) ? topicRaw : "other";
    const org = typeof body.org === "string" ? body.org.trim().slice(0, 160) : "";

    const emailCheck = validateEmail(body.email);
    if (!name || !message || !emailCheck.ok) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const email = emailCheck.email;

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    // headerSafe() strips CR/LF from everything reaching a header.
    const subject = headerSafe(`[${topic}] Contact from ${name}`);

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM_EMAIL ?? SALES_EMAIL,
            to: process.env.CONTACT_TO_EMAIL ?? SALES_EMAIL,
            replyTo: `${headerSafe(name)} <${headerSafe(email)}>`,
            subject,
            text: `Topic: ${topic}\nName: ${name}\nEmail: ${email}\nOrg: ${org || "-"}\n\n${message}`,
            html: `<h2>New contact — ${escapeHtml(topic)}</h2>
<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Org:</strong> ${escapeHtml(org || "-")}</p>
<hr>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
        });
    } catch (err) {
        console.error("[contact] send failed", err);
        return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    // Contact submissions were previously fire-and-forget with no record at all.
    if (sql) {
        await sql`INSERT INTO waitlist_events (kind, email_norm, detail)
                  VALUES ('contact', ${emailCheck.norm},
                          ${sql.json({ topic, name, org, ip_hash: ipHash })})`
            .catch(() => {});
    }

    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
}
