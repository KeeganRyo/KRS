# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally when design decisions conflict:

- **Business owners (buyers).** Owners of small Indonesian businesses (UMKM): cafes, restaurants, salons, barbershops, clinics, workshops (bengkel). They discover KR Solutions on the landing page, order through lynk.id or Instagram DM, activate their card on first scan, and later return to `/c/<kode>/edit` with a PIN to change the destination, rename the business, or check scan stats. Usually on a phone, often not technical.
- **Their customers (tappers).** People at the counter, table, or reception who tap the NFC board or scan its QR with their own phone. They should land on the destination (Google review, menu, Instagram, TikTok, WhatsApp) in one step, with no app install and no friction.

A third, internal audience is the KR Solutions admin at `/admin`, who creates card codes, downloads QR SVGs, unlocks locked cards, and resets PINs.

## Product Purpose

KR Solutions (krsolutions.tech, Jakarta) sells acrylic boards with an NFC chip and a matching QR code. One tap or scan opens whatever the owner chose: a Google review page, a digital menu, or a social/WhatsApp link. Success for the owner is more reviews and easier access to their menu and socials without reprinting anything; success for the tapper is reaching the destination instantly.

## Positioning

Confirmed differentiators against other NFC sticker/board sellers:

1. **Custom design per brand.** Colors, logo, and layout of the acrylic board are tailored to each business.
2. **Tap/scan statistics.** Owners see total scans and the last 14 days on their edit page.

Supporting capability (confirmed, not claimed as the main differentiator): the destination can be changed at any time with a PIN, without reprinting the board.

## Operating Context

- Board sits at the cashier, on tables, or at reception. Tappers use Android phones with NFC, iPhone XS and newer, or any phone camera for the QR.
- Each card has a unique code; URL `https://krsolutions.tech/c/<kode>` is written to the NFC sticker (locked read-only) and printed as the QR. First scan opens activation; later scans redirect straight to the destination.
- Ordering happens off-site at `https://lynk.id/krsolutions`; design briefs and PIN-reset requests go through Instagram DM `@krsolutions.id` or email `keegan@krsolutions.tech`.
- All copy is Indonesian, casual "kamu" register. The primary CTA is the English "GRAB YOURS NOW".

## Capabilities and Constraints

- Destination types: Review Google, Instagram, TikTok, WhatsApp, Menu / link lain.
- Google business lookup by pasted Maps link (no key) or by name (requires Places API key; rate limited, only for unactivated or PIN-unlocked cards).
- Security is part of the product: scrypt-hashed PIN entered twice at activation, atomic attempt limits with escalating lockout, 20-minute signed HttpOnly edit session, server-built destination URLs, forms that POST without JavaScript so a PIN never enters a URL.
- Stack: Next.js 15 (App Router), React 19, Supabase (service role only, RLS without policies), deployed on Vercel.
- Card and admin pages are not indexed; only the landing page is.

## Brand Commitments

- Name: KR Solutions. Mark: the K mark (`components/KMark.js`, `app/icon.svg`).
- Voice: plain, friendly Indonesian addressed to "kamu"; short concrete sentences about what happens on tap.
- "GRAB YOURS NOW" is the established order CTA.

## Evidence on Hand

- Real product photos (confirmed, not mockups): `public/tap.jpg` (customer tapping a review board at a cafe counter), `public/papan.jpg`, `public/produk.jpg`, design samples `public/d-orange.jpg`, `d-green.jpg`, `d-blue.jpg`, `d-sunset.jpg`, `d-menu-black.jpg`, `d-menu-white.jpg`.
- No testimonials, named customer businesses, customer counts, review-uplift figures, or pricing are confirmed. Do not fabricate any of them.

## Product Principles

1. **One tap, zero friction for the tapper.** Nothing should stand between a customer's phone and the destination.
2. **Owners stay in control without help.** Changing the destination, renaming, and reading stats must work on a phone for a non-technical owner.
3. **The board belongs to their brand.** Custom design is a core promise; the product should showcase and respect each business's identity.
4. **Show real things.** Use real photos and real numbers (the owner's own scan stats); never invented proof.
5. **Security is quiet but uncompromising.** PIN and session protections stay intact through any redesign.
