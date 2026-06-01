# Bloom Drip Co. TODO

## Resend Email Integration
- [x] Add RESEND_API_KEY secret to the project
- [x] Install Resend Node.js SDK (`resend` package)
- [x] Add RESEND_API_KEY to server ENV config (`server/_core/env.ts`)
- [x] Create server-side email helper (`server/email.ts`) with all HTML templates
- [x] Set `replyTo: info@bloomdripco.com` on ALL outgoing emails so client replies land in the inbox
- [x] Admin booking notification: replyTo = client email (one-click reply to client)
- [x] Client booking confirmation: replyTo = info@bloomdripco.com
- [x] Lead welcome email (BLOOM25 discount): replyTo = info@bloomdripco.com
- [x] Admin lead notification: replyTo = lead email (one-click follow-up)
- [x] Generic email sender for campaigns/review requests: replyTo = info@bloomdripco.com
- [x] Create tRPC email router (`server/routers/email.ts`) with sendBooking, sendLead, sendEmail procedures
- [x] Wire email router into main app router (`server/routers.ts`)
- [x] Update Home.tsx booking form to use tRPC mutation (no more localStorage API key)
- [x] Update Home.tsx lead capture popup to use tRPC mutation
- [x] Update Admin.tsx CampaignsPage to use tRPC mutation
- [x] Update Admin.tsx MarketingHubPage review requests to use tRPC mutation
- [x] Remove stale `apiKey` localStorage references from Admin.tsx
- [x] Write vitest tests for all email functions (15 tests, all passing)

## Booking Log & Unsubscribe System
- [x] Update sender address to noreply@bloomdripco.com (domain verified)
- [x] Add `bookings` table to DB schema (name, phone, email, service, date, notes, status, createdAt)
- [x] Add `unsubscribes` table to DB schema (email, token, unsubscribedAt)
- [x] Push DB migration
- [x] Save booking to DB on every booking form submission
- [x] tRPC procedures: listBookings, updateBookingStatus (admin)
- [x] tRPC procedures: unsubscribeByToken, unsubscribeEmail, listUnsubscribes
- [x] Admin panel: Booking Log tab — searchable, status filter, inline status dropdown, stats row
- [x] Admin panel: Unsubscribes tab — searchable list of opted-out emails with date
- [x] Add unsubscribe token to all campaign/marketing emails (origin-aware URL)
- [x] Public /unsubscribe page — token auto-unsubscribe + manual email fallback
- [x] Guard campaign sends: skip unsubscribed emails silently
- [x] Remove stale Resend API key field from Settings page (replaced with Email Integration status card)
- [x] Write vitest tests for booking and unsubscribe procedures (23 tests, all passing)
