# RSVP Confirmation Function

This Supabase Edge Function:

1. Calls `public.submit_wedding_rsvp(...)`
2. Uses the returned `guest_name`, `guest_email`, and `gift_names`
3. Sends the RSVP confirmation email through SMTP with Nodemailer
4. Sends an internal RSVP notification email to `CLIENT_NOTIFICATION_EMAIL`
5. Updates `confirmation_email_status` to `sent` or `failed`

## Required secrets

- `SMTP_HOST=eivor.aserv.co.za`
- `SMTP_PORT=465`
- `SMTP_USER=info@ndumisoandthembinkosi.online`
- `SMTP_PASS=your-mailbox-password`
- `SMTP_FROM=Thembinkosi and Ndumiso <info@ndumisoandthembinkosi.online>`
- `CLIENT_NOTIFICATION_EMAIL=nigtaitia@gmail.com`

Supabase hosted functions should also have:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deploy

```bash
supabase secrets set SMTP_HOST=eivor.aserv.co.za
supabase secrets set SMTP_PORT=465
supabase secrets set SMTP_USER=info@ndumisoandthembinkosi.online
supabase secrets set SMTP_PASS='YOUR_SMTP_PASSWORD'
supabase secrets set SMTP_FROM="Thembinkosi and Ndumiso <info@ndumisoandthembinkosi.online>"
supabase secrets set CLIENT_NOTIFICATION_EMAIL="nigtaitia@gmail.com"
supabase functions deploy rsvp-confirmation
```
