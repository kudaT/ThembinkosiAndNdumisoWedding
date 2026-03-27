# SMTP + Supabase Edge Function Setup

This project sends RSVP confirmation emails through the Supabase Edge Function at `supabase/functions/rsvp-confirmation`.

## Required secrets

Set these in Supabase Dashboard under `Edge Functions > Secrets`:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

Example:

- `SMTP_HOST=eivor.aserv.co.za`
- `SMTP_PORT=465`
- `SMTP_USER=info@ndumisoandthembinkosi.online`
- `SMTP_PASS=your-mailbox-password`
- `SMTP_FROM=Nd'umiso and Thembinkosi <info@ndumisoandthembinkosi.online>`

Supabase hosted functions should also have:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deploy

```bash
supabase secrets set SMTP_HOST=eivor.aserv.co.za
supabase secrets set SMTP_PORT=465
supabase secrets set SMTP_USER=info@ndumisoandthembinkosi.online
supabase secrets set SMTP_PASS='YOUR_SMTP_PASSWORD'
supabase secrets set SMTP_FROM="Nd'umiso and Thembinkosi <info@ndumisoandthembinkosi.online>"
supabase functions deploy rsvp-confirmation
```

## Test

1. Submit an RSVP from `rsvp.html`.
2. Confirm the RSVP row is created in `wedding_rsvps`.
3. Confirm `confirmation_email_status` becomes `sent`.
4. Confirm the guest receives the email.

If the RSVP is saved but email sending fails, the UI will still show the RSVP success message and display the email delivery error separately.
