import { createClient } from "jsr:@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer@6.10.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const DEFAULT_CLIENT_NOTIFICATION_EMAIL = "nigtaitia@gmail.com";

function renderAttendingEmail(guestName: string, giftList: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia, 'Times New Roman', serif;color:#111111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#fafafa 0%,#f1f1f1 38%,#d3d3d3 100%);padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#3f3f3f;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.18);">
          <tr>
            <td style="padding:40px 36px 20px;text-align:center;background:linear-gradient(180deg,#2b2b2b 0%,#101010 100%);border-bottom:1px solid rgba(255,255,255,0.12);">
              <div style="font-size:42px;line-height:1;color:#ffffff;font-family:Georgia, 'Times New Roman', serif;letter-spacing:0.08em;">T &amp; N</div>
              <p style="margin:14px 0 0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.76);">Wedding RSVP Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 36px;">
              <h1 style="margin:0 0 18px;font-size:34px;font-weight:600;color:#ffffff;">We are so glad you are coming</h1>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.92);">Dear ${guestName},</p>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.84);">Thank you for your RSVP. Our hearts are full knowing that you will be joining us on our special day.</p>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.84);">Your presence means so much to us, and we are truly grateful to celebrate this joyful moment with you.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;background:#151515;border:1px solid rgba(255,255,255,0.08);border-radius:20px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:rgba(255,255,255,0.72);">Wedding Details</p>
                    <p style="margin:0 0 8px;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Date:</strong> 18 July 2026</p>
                    <p style="margin:0 0 8px;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Matrimonial Ceremony:</strong> 10:30 at Trinity Church Morningside</p>
                    <p style="margin:0 0 8px;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Reception:</strong> 12:00 at Durban Botanical Gardens Hall</p>
                    <p style="margin:0;font-size:17px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Gift Selection:</strong> ${giftList}</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.84);">We cannot wait to share this beautiful day with you, filled with love, laughter, and cherished memories.</p>
              <p style="margin:0;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.92);">With love,<br><strong>Thembinkosi and Ndumiso</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderDecliningEmail(guestName: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Georgia, 'Times New Roman', serif;color:#111111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:linear-gradient(180deg,#fafafa 0%,#f1f1f1 38%,#d3d3d3 100%);padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#3f3f3f;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.18);">
          <tr>
            <td style="padding:40px 36px 20px;text-align:center;background:linear-gradient(180deg,#2b2b2b 0%,#101010 100%);border-bottom:1px solid rgba(255,255,255,0.12);">
              <div style="font-size:42px;line-height:1;color:#ffffff;font-family:Georgia, 'Times New Roman', serif;letter-spacing:0.08em;">T &amp; N</div>
              <p style="margin:14px 0 0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.76);">Wedding RSVP Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 36px 36px;">
              <h1 style="margin:0 0 18px;font-size:34px;font-weight:600;color:#ffffff;">Thank you for letting us know</h1>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.92);">Dear ${guestName},</p>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.84);">Thank you for taking the time to respond to our wedding invitation.</p>
              <p style="margin:0 0 18px;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.84);">While we will miss having you with us on the day, we truly appreciate your honesty and your warm wishes.</p>
              <p style="margin:0;font-size:18px;line-height:1.8;color:rgba(255,255,255,0.92);">With love,<br><strong>Thembinkosi and Ndumiso</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderNotificationEmail(guestName: string, guestEmail: string, attendance: string, guestCount: number, giftList: string[], message: string | null) {
  const heading = attendance === "Joyfully attending" ? "A guest is attending" : "A guest is declining";
  const statusLabel = attendance === "Joyfully attending" ? "Attending" : "Declining";
  const gifts = giftList.length ? giftList.join(", ") : "None selected";
  const note = message?.trim() ? message.trim() : "No message left.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RSVP Notification</title>
</head>
<body style="margin:0;padding:24px 12px;background:linear-gradient(180deg,#fafafa 0%,#f1f1f1 38%,#d3d3d3 100%);font-family:Georgia, 'Times New Roman', serif;color:#111111;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#3f3f3f;border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;box-shadow:0 18px 40px rgba(0,0,0,0.18);">
          <tr>
            <td style="padding:32px 36px 18px;text-align:center;background:linear-gradient(180deg,#2b2b2b 0%,#101010 100%);border-bottom:1px solid rgba(255,255,255,0.12);">
              <div style="font-size:34px;line-height:1;color:#ffffff;font-family:Georgia, 'Times New Roman', serif;letter-spacing:0.08em;">T &amp; N</div>
              <p style="margin:12px 0 0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.76);">RSVP Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 36px 36px;">
              <h1 style="margin:0 0 18px;font-size:30px;font-weight:600;color:#ffffff;">${heading}</h1>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#151515;border:1px solid rgba(255,255,255,0.08);border-radius:20px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Name:</strong> ${guestName}</p>
                    <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Email:</strong> ${guestEmail}</p>
                    <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Status:</strong> ${statusLabel}</p>
                    <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Guests:</strong> ${guestCount}</p>
                    <p style="margin:0 0 10px;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Gift Selection:</strong> ${gifts}</p>
                    <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,0.84);"><strong style="color:#ffffff;">Message:</strong> ${note}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });
}

async function markEmailStatus(
  supabase: ReturnType<typeof createClient>,
  rsvpId: string,
  status: "sent" | "failed",
) {
  const payload: Record<string, string> = {
    confirmation_email_status: status,
  };

  if (status === "sent") {
    payload.confirmation_email_sent_at = new Date().toISOString();
  }

  await supabase
    .from("wedding_rsvps")
    .update(payload)
    .eq("id", rsvpId);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data, error } = await supabase.rpc("submit_wedding_rsvp", body);

    if (error) {
      return jsonResponse({ message: error.message, email_sent: false }, 400);
    }

    const guestName = data.guest_name as string;
    const guestEmail = data.guest_email as string;
    const rsvpId = data.id as string;
    const attendance = body.p_attendance as string;
    const guestCount = Number(body.p_guest_count ?? 1);
    const guestMessage = (body.p_message as string | null) ?? null;
    const giftNames = (data.gift_names as string[]) ?? [];
    const otherGift = data.other_gift as string | null;
    const finalGiftList = [...giftNames, ...(otherGift ? [otherGift] : [])];
    const smtpHost = Deno.env.get("SMTP_HOST");
    const smtpPort = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const smtpUser = Deno.env.get("SMTP_USER");
    const smtpPass = Deno.env.get("SMTP_PASS");
    const smtpFrom = Deno.env.get("SMTP_FROM") ?? smtpUser;
    const clientNotificationEmail = Deno.env.get("CLIENT_NOTIFICATION_EMAIL") ?? DEFAULT_CLIENT_NOTIFICATION_EMAIL;

    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      await markEmailStatus(supabase, rsvpId, "failed");
      return jsonResponse({
        message: data.message,
        email_sent: false,
        email_error: "Missing SMTP_HOST, SMTP_USER, SMTP_PASS, or SMTP_FROM secret.",
        guest_name: guestName,
        gift_names: finalGiftList,
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const subject = attendance === "Joyfully attending"
      ? "Your RSVP is Confirmed | Thembinkosi & Ndumiso"
      : "Thank You for Your RSVP | Thembinkosi & Ndumiso";
    const notificationSubject = attendance === "Joyfully attending"
      ? `New RSVP Attending | ${guestName}`
      : `New RSVP Declining | ${guestName}`;

    const html = attendance === "Joyfully attending"
      ? renderAttendingEmail(guestName, finalGiftList.length ? finalGiftList.join(", ") : "Your special gift note")
      : renderDecliningEmail(guestName);
    const notificationHtml = renderNotificationEmail(
      guestName,
      guestEmail,
      attendance,
      guestCount,
      finalGiftList,
      guestMessage,
    );

    await transporter.sendMail({
      from: smtpFrom,
      to: guestEmail,
      subject,
      html,
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: clientNotificationEmail,
      subject: notificationSubject,
      html: notificationHtml,
    });

    await markEmailStatus(supabase, rsvpId, "sent");

    return jsonResponse({
      message: data.message,
      email_sent: true,
      guest_name: guestName,
      gift_names: finalGiftList,
    });
  } catch (error) {
    return jsonResponse({
      message: error instanceof Error ? error.message : "Unexpected error sending RSVP email.",
      email_sent: false,
    }, 500);
  }
});


