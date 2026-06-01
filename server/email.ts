import { Resend } from "resend";
import { ENV } from "./_core/env";

// Lazy-initialize so tests that don't exercise email don't need a real key
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!ENV.resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    _resend = new Resend(ENV.resendApiKey);
  }
  return _resend;
}

// ─── Sender / reply address ───────────────────────────────────────────────────
// Domain bloomdripco.com is verified in Resend — sending from noreply@bloomdripco.com.
const FROM_BOOKING  = "Bloom Drip Co. Bookings <noreply@bloomdripco.com>";
const FROM_LEAD     = "Bloom Drip Co. <noreply@bloomdripco.com>";
const ADMIN_EMAIL   = "info@bloomdripco.com";

// All outgoing emails set reply_to so client replies always land in the inbox.
const REPLY_TO = ADMIN_EMAIL;

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BookingData {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  notes?: string;
  submittedAt?: string;
}

export interface LeadData {
  name: string;
  email: string;
}

// ─── HTML templates ───────────────────────────────────────────────────────────
function buildBookingAdminHtml(f: BookingData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>New Booking Request — Bloom Drip Co.</title>
</head>
<body style="margin:0;padding:0;background:#020b14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#020b14;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a1a2a;border-radius:16px;border:1px solid rgba(201,168,76,0.3);overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg,#0a1a2a 0%,#0d2035 100%);padding:36px 40px;border-bottom:1px solid rgba(201,168,76,0.3);text-align:center;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:10px;">Bloom Drip Co. · Los Angeles</div>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#edeae0;letter-spacing:-0.02em;">New Booking <span style="color:#c9a84c;font-style:italic;">Request</span></h1>
          <div style="margin-top:12px;display:inline-block;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.35);border-radius:20px;padding:5px 16px;font-size:12px;color:#e5ca70;letter-spacing:0.08em;">⚡ Action Required</div>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 40px;">
          <p style="margin:0 0 28px;font-size:14px;color:rgba(200,216,232,0.65);line-height:1.7;">A new appointment request has just come in. Review the details below and confirm within 2 hours.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td colspan="2" style="padding-bottom:12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.7);border-bottom:1px solid rgba(201,168,76,0.2);font-weight:600;">Client Information</td></tr>
            <tr>
              <td style="padding:14px 0 0;width:50%;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Full Name</div>
                <div style="font-size:15px;color:#edeae0;font-weight:600;">${f.name}</div>
              </td>
              <td style="padding:14px 0 0;width:50%;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Phone</div>
                <div style="font-size:15px;color:#edeae0;font-weight:600;">${f.phone || "—"}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 0 0;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Email</div>
                <div style="font-size:15px;color:#c9a84c;">${f.email || "—"}</div>
              </td>
              <td style="padding:14px 0 0;vertical-align:top;">
                <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:rgba(200,216,232,0.45);margin-bottom:4px;">Preferred Date</div>
                <div style="font-size:15px;color:#edeae0;font-weight:600;">${f.date || "—"}</div>
              </td>
            </tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td colspan="2" style="padding-bottom:12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.7);border-bottom:1px solid rgba(201,168,76,0.2);font-weight:600;">Requested Service</td></tr>
            <tr>
              <td style="padding:16px 0 0;">
                <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.25);border-radius:10px;padding:16px 20px;">
                  <div style="font-family:Georgia,serif;font-size:20px;color:#c9a84c;font-weight:700;margin-bottom:4px;">${f.service}</div>
                  <div style="font-size:12px;color:rgba(200,216,232,0.5);">IV Therapy Session · Bloom Drip Co.</div>
                </div>
              </td>
            </tr>
          </table>
          ${f.notes ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="padding-bottom:12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.7);border-bottom:1px solid rgba(201,168,76,0.2);font-weight:600;">Notes / Location</td></tr>
            <tr><td style="padding:14px 0 0;font-size:14px;color:rgba(200,216,232,0.75);line-height:1.7;">${f.notes}</td></tr>
          </table>` : ""}
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center" style="padding-top:8px;">
                <a href="mailto:${f.email}" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#8f7630);color:#010a12;font-weight:700;font-size:14px;letter-spacing:0.06em;text-transform:uppercase;padding:14px 36px;border-radius:50px;text-decoration:none;">Reply to Client</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#071828;padding:24px 40px;border-top:1px solid rgba(201,168,76,0.15);text-align:center;">
          <div style="font-family:Georgia,serif;font-size:14px;color:rgba(201,168,76,0.6);margin-bottom:6px;">Bloom Drip Co.</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.3);letter-spacing:0.06em;">Luxury Mobile IV Infusion · Los Angeles, CA · (818) 515-8980</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.2);margin-top:8px;">Submitted: ${f.submittedAt ?? "—"}</div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildBookingClientHtml(f: BookingData): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Booking Received — Bloom Drip Co.</title>
</head>
<body style="margin:0;padding:0;background:#020b14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#020b14;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a1a2a;border-radius:16px;border:1px solid rgba(201,168,76,0.3);overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg,#0a1a2a 0%,#0d2035 100%);padding:40px 40px 32px;border-bottom:1px solid rgba(201,168,76,0.3);text-align:center;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:10px;">Bloom Drip Co. · Los Angeles</div>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:700;color:#edeae0;">We've Got Your <span style="color:#c9a84c;font-style:italic;">Request!</span> 💛</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 40px;">
          <p style="margin:0 0 20px;font-size:15px;color:rgba(200,216,232,0.75);line-height:1.8;">Hi <strong style="color:#edeae0;">${f.name}</strong>,</p>
          <p style="margin:0 0 24px;font-size:14px;color:rgba(200,216,232,0.65);line-height:1.8;">Thank you for choosing Bloom Drip Co.! We've received your booking request and our team will confirm your appointment within <strong style="color:#c9a84c;">2 hours</strong>. A certified Registered Nurse will be in touch shortly.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.2);border-radius:12px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.6);margin-bottom:14px;font-weight:600;">Your Booking Summary</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:6px 0;font-size:13px;color:rgba(200,216,232,0.5);width:40%;">Service</td><td style="padding:6px 0;font-size:13px;color:#edeae0;font-weight:600;">${f.service}</td></tr>
                <tr><td style="padding:6px 0;font-size:13px;color:rgba(200,216,232,0.5);">Preferred Date</td><td style="padding:6px 0;font-size:13px;color:#edeae0;font-weight:600;">${f.date || "To be confirmed"}</td></tr>
                ${f.notes ? `<tr><td style="padding:6px 0;font-size:13px;color:rgba(200,216,232,0.5);vertical-align:top;">Notes</td><td style="padding:6px 0;font-size:13px;color:#edeae0;">${f.notes}</td></tr>` : ""}
              </table>
            </td></tr>
          </table>
          <p style="margin:0 0 28px;font-size:13px;color:rgba(200,216,232,0.5);line-height:1.7;">Questions? Reply to this email or call us at <a href="tel:8185158980" style="color:#c9a84c;text-decoration:none;">(818) 515-8980</a>.</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="https://bloomdrip-fm7zlieb.manus.space" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#8f7630);color:#010a12;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;padding:13px 32px;border-radius:50px;text-decoration:none;">Visit Our Website</a>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#071828;padding:24px 40px;border-top:1px solid rgba(201,168,76,0.15);text-align:center;">
          <div style="font-family:Georgia,serif;font-size:14px;color:rgba(201,168,76,0.6);margin-bottom:6px;">Bloom Drip Co.</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.3);letter-spacing:0.06em;">Luxury Mobile IV Infusion · Los Angeles, CA</div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function buildLeadWelcomeHtml(name: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/><title>Your $25 Discount — Bloom Drip Co.</title></head>
<body style="margin:0;padding:0;background:#020b14;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#020b14;padding:40px 20px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a1a2a;border-radius:16px;border:1px solid rgba(201,168,76,0.3);overflow:hidden;">
      <tr>
        <td style="background:linear-gradient(135deg,#0a1a2a,#0d2035);padding:40px;border-bottom:1px solid rgba(201,168,76,0.3);text-align:center;">
          <div style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(201,168,76,0.7);margin-bottom:10px;">Bloom Drip Co. · Los Angeles</div>
          <h1 style="margin:0;font-family:Georgia,serif;font-size:26px;color:#edeae0;">Welcome to <span style="color:#c9a84c;font-style:italic;">Bloom</span> 💛</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:36px 40px;">
          <p style="font-size:15px;color:rgba(200,216,232,0.75);line-height:1.8;margin:0 0 20px;">Hi <strong style="color:#edeae0;">${name || "there"}</strong>,</p>
          <p style="font-size:14px;color:rgba(200,216,232,0.65);line-height:1.8;margin:0 0 28px;">Thank you for joining the Bloom family! As promised, here's your exclusive first-timer discount:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.25);border-radius:12px;margin-bottom:28px;">
            <tr><td style="padding:24px;text-align:center;">
              <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(201,168,76,0.6);margin-bottom:8px;">Your Discount Code</div>
              <div style="font-family:Georgia,serif;font-size:36px;font-weight:700;color:#c9a84c;letter-spacing:0.08em;">BLOOM25</div>
              <div style="font-size:13px;color:rgba(200,216,232,0.5);margin-top:8px;">$25 off your first IV session</div>
            </td></tr>
          </table>
          <p style="font-size:13px;color:rgba(200,216,232,0.5);line-height:1.7;margin:0 0 28px;">Use this code when booking your first session. Valid for any drip on our menu. No expiration — take your time.</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="https://bloomdrip-fm7zlieb.manus.space/#booking" style="display:inline-block;background:linear-gradient(135deg,#c9a84c,#8f7630);color:#010a12;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;padding:14px 36px;border-radius:50px;text-decoration:none;">Book My First Session →</a>
            </td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="background:#071828;padding:24px 40px;border-top:1px solid rgba(201,168,76,0.15);text-align:center;">
          <div style="font-family:Georgia,serif;font-size:14px;color:rgba(201,168,76,0.6);margin-bottom:6px;">Bloom Drip Co.</div>
          <div style="font-size:11px;color:rgba(200,216,232,0.3);">Luxury Mobile IV Infusion · Los Angeles, CA · (818) 515-8980</div>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send booking confirmation emails:
 * 1. Admin notification to info@bloomdripco.com
 * 2. Client confirmation (if email provided)
 *
 * reply_to is set to ADMIN_EMAIL on all outgoing mail so any client
 * reply lands directly in the Bloom Drip Co. inbox.
 */
export async function sendBookingEmails(data: BookingData): Promise<void> {
  const resend = getResend();
  const submittedAt = new Date().toLocaleString("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
  const enriched = { ...data, submittedAt };

  // Admin notification — reply_to the client so you can respond in one click
  await resend.emails.send({
    from: FROM_BOOKING,
    to: [ADMIN_EMAIL],
    replyTo: data.email || REPLY_TO,
    subject: `🌸 New Booking Request — ${data.name} · ${data.service}`,
    html: buildBookingAdminHtml(enriched),
  });

  // Client confirmation — reply_to the admin inbox
  if (data.email) {
    await resend.emails.send({
      from: FROM_BOOKING,
      to: [data.email],
    replyTo: REPLY_TO,
    subject: "Your Bloom Drip Co. Booking Request is Confirmed 💛",
      html: buildBookingClientHtml(enriched),
    });
  }
}

/**
 * Send lead-capture welcome email with BLOOM25 discount code.
 * Also notifies admin of the new lead.
 */
export async function sendLeadWelcomeEmail(data: LeadData): Promise<void> {
  const resend = getResend();

  // Welcome email to lead — reply_to admin inbox
  await resend.emails.send({
    from: FROM_LEAD,
    to: [data.email],
    replyTo: REPLY_TO,
    subject: "Your $25 Bloom Drip Co. Discount is Here 💛",
    html: buildLeadWelcomeHtml(data.name),
  });

  // Admin notification — reply_to the lead so you can follow up in one click
  await resend.emails.send({
    from: FROM_LEAD,
    to: [ADMIN_EMAIL],
    replyTo: data.email,
    subject: `🌸 New Lead Captured — ${data.name || data.email}`,
    html: `<div style="font-family:sans-serif;background:#0a1a2a;color:#edeae0;padding:32px;border-radius:12px;">
      <h2 style="color:#c9a84c;font-family:Georgia,serif;">New Lead Captured</h2>
      <p><strong>Name:</strong> ${data.name || "—"}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Discount Code Sent:</strong> BLOOM25</p>
      <p style="color:rgba(200,216,232,0.5);font-size:12px;">Reply to this email to follow up with the lead directly.</p>
    </div>`,
  });
}

/**
 * Lightweight key validation — sends a test ping to Resend.
 * Returns true if the key is valid, false otherwise.
 */
export async function validateResendKey(): Promise<boolean> {
  try {
    const resend = getResend();
    // Listing domains is a lightweight read-only call that confirms auth
    const result = await resend.domains.list();
    return !result.error;
  } catch {
    return false;
  }
}

/**
 * Generic email sender for admin-initiated emails (campaigns, review requests, etc.)
 * Always sets replyTo to info@bloomdripco.com so client replies are never lost.
 * If unsubscribeUrl is provided it is appended as a footer to the HTML.
 */
export interface GenericEmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  unsubscribeUrl?: string;
}

function appendUnsubscribeFooter(html: string, unsubscribeUrl: string): string {
  const footer = `
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
  <tr><td align="center" style="padding:16px;border-top:1px solid rgba(201,168,76,0.12);">
    <p style="font-size:11px;color:rgba(200,216,232,0.3);margin:0;font-family:Arial,sans-serif;">
      You're receiving this because you're a Bloom Drip Co. client or subscriber.
      <a href="${unsubscribeUrl}" style="color:rgba(201,168,76,0.5);text-decoration:underline;">Unsubscribe</a>
    </p>
  </td></tr>
</table>`;
  // Insert before closing </body> if present, otherwise append
  if (html.includes("</body>")) {
    return html.replace("</body>", footer + "</body>");
  }
  return html + footer;
}

export async function sendGenericEmail(data: GenericEmailData): Promise<void> {
  const resend = getResend();
  const toAddresses = Array.isArray(data.to) ? data.to : [data.to];
  const finalHtml = data.unsubscribeUrl
    ? appendUnsubscribeFooter(data.html, data.unsubscribeUrl)
    : data.html;
  await resend.emails.send({
    from: data.from ?? FROM_BOOKING,
    to: toAddresses,
    replyTo: REPLY_TO,
    subject: data.subject,
    html: finalHtml,
  });
}
