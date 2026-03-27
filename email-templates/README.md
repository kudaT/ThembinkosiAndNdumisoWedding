# RSVP Email Templates

Templates for wedding RSVP confirmation emails.

## Files

- `rsvp-attending.html`: Sent when a guest confirms they will attend.
- `rsvp-declining.html`: Sent when a guest regrets that they cannot attend.

## Suggested subjects

- Attending: `Your RSVP is Confirmed | Thembinkosi & Ndumiso`
- Declining: `Thank You for Your RSVP | Thembinkosi & Ndumiso`

## Template variables

- `{{guest_name}}`
- `{{gift_name}}` for the attending email

## SMTP note

Do not place SMTP credentials in frontend files. Use them only from a secure server-side function or mail worker.
