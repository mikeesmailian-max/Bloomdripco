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
