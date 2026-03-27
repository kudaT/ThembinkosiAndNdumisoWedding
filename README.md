# Wedding Invitation Website

Static wedding invitation website built for cPanel-style hosting.

## Files

- `index.html`: Main single-page website.
- `styles.css`: Romantic responsive styling and animations.
- `script.js`: Countdown timer, reveal animation, mobile nav, and Supabase-backed RSVP handling through an Edge Function.
- `supabase-config.js`: Local Supabase URL and anon key for the RSVP form.
- `supabase-wedding.sql`: Database schema, gift seed data, and the RSVP submission RPC.
- `supabase-wedding-deploy.sql`: Full hosted Supabase setup script for online deployment.
- `SMTP_SETUP.md`: SMTP + Supabase Edge Function setup steps for RSVP confirmation emails.
- `supabase/functions/rsvp-confirmation`: Edge Function that stores the RSVP and sends the confirmation email.
- `assets/music/romantic-instrumental.mp3`: Optional background music file you can add manually.

## Customize

Update these items before deployment if needed:

- Couple names, date, venue, and contact details in `index.html`
- Image URLs in `index.html`
- Wedding countdown date in `script.js`
- Supabase project URL and anon key in `supabase-config.js`

## cPanel / Afrihost Deploy

1. Open your cPanel File Manager.
2. Upload all project files into `public_html` or your target domain folder.
3. If you want background music, upload `romantic-instrumental.mp3` into `assets/music/`.
4. Point `supabase-config.js` to your hosted Supabase project before going live.
5. Deploy the `rsvp-confirmation` Edge Function and add your SMTP secrets before accepting live RSVPs.
6. Visit your domain and confirm the site loads correctly.

No build step is required.
