---
name: KR Solutions
description: NFC + QR acrylic boards for Indonesian small businesses; one tap opens a review, menu, or social link.
colors:
  electric-ultramarine: "#2C21C4"
  midnight-ultramarine: "#1A1190"
  ink-night: "#0E0A3A"
  signal-periwinkle: "#7E87FE"
  glow-violet: "#5D55F2"
  mist-lavender: "#EEF0FF"
  page-lavender: "#F5F5FF"
  paper-white: "#FFFFFF"
  hairline-lavender: "#D6D8F5"
  text-indigo-ink: "#1B1747"
  muted-dusk: "#58557F"
  on-dark-lilac: "#DADCFF"
  status-green: "#1B6B3A"
  status-green-wash: "#EAF6EE"
  status-red: "#B3261E"
  status-red-wash: "#FDECEA"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Inter, system-ui, sans-serif"
    fontSize: "clamp(38px, 5.4vw, 66px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, Inter, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.8vw, 46px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bricolage Grotesque, Inter, system-ui, sans-serif"
    fontSize: "21px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  card-title:
    fontFamily: "Bricolage Grotesque, Inter, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.55
  lead:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  eyebrow:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.06em"
  stat-number:
    fontFamily: "Bricolage Grotesque, Inter, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.1
    fontFeature: "tnum"
rounded:
  tag: "8px"
  field: "14px"
  tile: "16px"
  panel: "18px"
  media: "24px"
  card: "28px"
  hero-photo: "32px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "28px"
  xl: "56px"
  section: "96px"
  section-mobile: "72px"
  gutter: "24px"
  container: "1120px"
components:
  button-primary:
    backgroundColor: "{colors.electric-ultramarine}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "14px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.midnight-ultramarine}"
  button-soft:
    backgroundColor: "{colors.mist-lavender}"
    textColor: "{colors.midnight-ultramarine}"
    rounded: "{rounded.pill}"
    padding: "14px"
  button-on-dark:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.midnight-ultramarine}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  button-on-dark-hover:
    backgroundColor: "{colors.mist-lavender}"
  button-ghost-on-dark:
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  input:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.text-indigo-ink}"
    rounded: "{rounded.field}"
    padding: "13px 15px"
  chip:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.text-indigo-ink}"
    rounded: "{rounded.pill}"
    padding: "9px 14px"
  chip-selected:
    backgroundColor: "{colors.electric-ultramarine}"
    textColor: "{colors.paper-white}"
  card:
    backgroundColor: "{colors.paper-white}"
    rounded: "{rounded.card}"
    padding: "32px 28px"
    width: "460px"
  info-panel:
    backgroundColor: "{colors.mist-lavender}"
    rounded: "{rounded.panel}"
    padding: "14px 16px"
  stat-tile:
    textColor: "{colors.midnight-ultramarine}"
    rounded: "{rounded.tile}"
    padding: "14px 12px"
  tag:
    backgroundColor: "{colors.mist-lavender}"
    textColor: "{colors.muted-dusk}"
    rounded: "{rounded.pill}"
    padding: "1px 8px"
---

# Design System: KR Solutions

## Overview

**Creative North Star: "The Acrylic Glow"**

Every important surface is a clean white panel floating over indigo light, like an acrylic board lit up on a cafe counter. The board itself is the product, so the interface borrows its physics: a sheet of paper-white with generous rounded corners, lifted off a deep ultramarine field that brightens toward one corner as if a lamp sits just out of frame. The landing page hero, the activation and edit cards, and the admin login all follow this same staging.

The personality is tidy and calm (rapi dan tenang). The single saturated hue does the talking; everything else stays quiet so a non-technical owner on a phone always knows where to press. Type pairs a characterful grotesque for headlines with a neutral workhorse for everything functional. Density is low on customer-facing surfaces and moderate in admin, where a table carries the load.

Depth is layered. White panels lift over dark fields with a long, deep indigo shadow, and on light sections panels and media also sit on soft indigo-tinted shadows, so the whole system reads as stacked acrylic rather than flat paper.

**Key Characteristics:**
- One hue family (ultramarine to periwinkle) carries all brand color; green and red appear only as status.
- Paper-white panels on indigo gradient fields, never the reverse.
- Pill buttons and chips; generously rounded panels (14 to 32px).
- Bricolage Grotesque headlines with tight negative tracking; Inter for all UI text.
- Indigo-tinted shadows, never neutral grey.
- Short, eased entrance motion (rise, pop, grow) that is fully disabled under reduced motion.

## Colors

A monochrome ultramarine world: one saturated indigo, its darker night tones, a soft periwinkle signal, and lavender-tinted neutrals.

### Primary
- **Electric Ultramarine** (`electric-ultramarine`): the action color. Primary buttons, selected chips, numbered step badges, checklist dots, input focus border, eyebrow text, and links. Also the bright stop of every brand gradient.
- **Midnight Ultramarine** (`midnight-ultramarine`): hover state for primary buttons, the middle stop of the hero gradient, brand-name text in cards, stat numbers, and text on soft buttons. Also the browser theme color.
- **Ink Night** (`ink-night`): the darkest gradient stop and the footer background.

### Secondary
- **Signal Periwinkle** (`signal-periwinkle`): the focus ring color everywhere, check marks in the hero proof list, and the top of the stat bar gradient. A light signal on dark fields.
- **Glow Violet** (`glow-violet`): only as the radial "lamp" glow in the top-right of hero and card backdrops.

### Neutral
- **Paper White** (`paper-white`): panels, cards, inputs, the landing page base.
- **Page Lavender** (`page-lavender`): app-wide body background behind non-card pages (admin).
- **Mist Lavender** (`mist-lavender`): alternating landing sections, soft buttons, info panels ("Tujuan sekarang", "Simpan baik-baik"), code badges, FAQ toggles.
- **Hairline Lavender** (`hairline-lavender`): input and chip borders, list dividers. Lighter dividers inside cards and tables use #ECEDFA to #F0F1FB.
- **Text Indigo Ink** (`text-indigo-ink`): headings and body text on light surfaces. Text is never pure black.
- **Muted Dusk** (`muted-dusk`): secondary copy, hints, captions, table headers.
- **On-Dark Lilac** (`on-dark-lilac`): body text and nav links on indigo fields; headings on dark stay pure white.

### Status
- **Status Green** on **Status Green Wash**: success messages, the picked-business confirmation, active tags. The hero "Halaman review terbuka" badge uses a brighter live-dot green (#2BB24C).
- **Status Red** on **Status Red Wash**: errors, lockout tags, destructive mini buttons.

### Named Rules
**The One Hue Rule.** Brand color comes only from the ultramarine family. Green and red mean status and nothing else; never use them for decoration or emphasis.

**The Lamp Rule.** Dark fields are always a 165° linear gradient from Electric Ultramarine through Midnight Ultramarine to Ink Night, with an optional Glow Violet radial in the upper right. A flat dark fill is not part of the system (the footer is the only exception).

## Typography

**Display Font:** Bricolage Grotesque (with Inter, system-ui fallback), weights 500 and 700
**Body Font:** Inter (with system-ui, -apple-system, Segoe UI, Roboto fallback), weights 400 and 500

**Character:** Bricolage brings a slightly quirky, friendly grotesque voice to headlines; Inter keeps every label, field, and paragraph plain and readable. The contrast is in the headings only, so body stays calm.

### Hierarchy
- **Display** (700, clamp 38 to 66px, line-height 1.04, -0.03em): the landing hero headline only, capped near 12em wide.
- **Headline** (700, clamp 28 to 46px, 1.1, -0.025em): landing section headings, capped near 16em.
- **Card Title** (700, 30px, 1.1, -0.02em): the h1 inside activation, edit, and admin cards.
- **Title** (700, 19 to 23px): use-case cards, step titles, FAQ questions.
- **Lead** (400, 17 to 19px, 1.6): hero lead and section subheads, max about 30 to 34em.
- **Body** (400, 16px, 1.55): paragraphs in cards and on the landing page.
- **Label** (500, 14 to 15px): field labels, chip text, button text (16px on buttons).
- **Eyebrow** (500, 12 to 13px, 0.06em, uppercase): small context labels above card titles and in info panels; table headers use the same treatment at 12px.
- **Stat Number** (Bricolage 700, 26px, tabular numerals): scan counts.

### Named Rules
**The Two-Weight Rule.** Inter is used only at 400 and 500. Emphasis in UI text comes from 500 and color, never from bold.

**The Tabular Rule.** Card codes, PINs, and every count use tabular numerals; codes and PINs also get wide letter-spacing (0.08em for codes, 0.5em for PIN fields).

## Layout

Landing content sits in a 1120px container with 24px gutters. Sections breathe at 96px vertical padding (72px under 820px). Two-column grids are asymmetric: hero 1.05fr / 0.95fr, steps and FAQ 0.8fr / 1.2fr, edit section 1fr / 1fr, all with a 56px gap. At 820px and below every grid collapses to one column and secondary nav links hide, leaving only the brand and the "Edit kartu" pill.

The design rail breaks out of the container: it scrolls horizontally edge to edge with padding that aligns its first item to the container edge, and snaps per item (300px items, 72vw on phones).

Card pages (activation, edit, admin login) center a single 460px card (560px wide variant) on the full-height gradient field with 24px / 16px page padding. Under 420px the card tightens to 28px / 20px padding and 24px radius, and paired PIN fields stack.

Admin is a 1120px max-width page on Page Lavender with a white, rounded, horizontally scrollable table.

## Elevation & Depth

Layered acrylic. Panels lift off whatever they sit on, and every shadow is tinted with deep indigo (rgba of #06033C or #1A1190), never neutral grey. Shadows use a large negative spread so they pool beneath the panel instead of haloing around it. On dark fields the lift is dramatic; on light sections it is soft but present, so stacked sheets read as a family.

### Shadow Vocabulary
- **Deep lift** (`box-shadow: 0 40px 80px -24px rgba(6,3,60,.7)`): white cards over the gradient field, and the hero photo (alpha .75).
- **Float** (`box-shadow: 0 20px 40px -12px rgba(6,3,60,.5)`): small floating badges over imagery, such as the "Halaman review terbuka" badge.
- **Soft lift** (`box-shadow: 0 30px 60px -30px rgba(26,17,144,.35)`): white panels on light or Mist sections, such as the landing "Edit kartu" form. This is the default for any raised surface on a light background.
- **Device lift** (`box-shadow: 0 30px 60px -20px rgba(6,3,60,.6)`): the illustrated phone inside the gradient tile.
- **Focus halo** (`box-shadow: 0 0 0 3px rgba(44,33,196,.15)`): focused inputs and input groups.

### Named Rules
**The Indigo Shadow Rule.** Shadows are always indigo-tinted and spread-negative. A grey or symmetric drop shadow breaks the acrylic illusion.

**The Stacked Sheets Rule.** On light sections, raised content (forms, media tiles, panels) uses Soft lift rather than sitting flat. Hairline borders handle lists and tables; shadows handle objects.

## Shapes

Everything is rounded, and the radius grows with the object: tags 8px, fields and result rows 14px, stat tiles 16px, info panels 18px, media tiles and landing panels 24px, cards 28px, the hero photo 32px. Every button, chip, nav pill, and tag is a full pill (999px). Circles appear for step numbers, check dots, the activation success badge, and the FAQ toggle. Borders are 1px hairlines in lavender; the only 2px stroke is the outline button inside the phone illustration.

The K mark (`components/KMark.js`) is the one fixed geometric asset: a solid upright bar plus a swept diagonal, rendered in currentColor.

## Components

Tidy and calm: soft shapes, one action color, quiet states.

### Buttons
- **Shape:** full pill (999px).
- **Primary:** Electric Ultramarine fill, white 16px / 500 text, 14px padding, full width inside cards. On the landing page buttons are inline with 15px 28px padding.
- **Hover / Active:** hover darkens to Midnight Ultramarine (only on fine-pointer devices). Press scales to 0.97 over 160ms. Disabled drops to 60% opacity.
- **Soft:** Mist Lavender fill with Midnight Ultramarine text; hover #E1E4FF.
- **On dark (main):** white fill with Midnight Ultramarine text; hover Mist Lavender. Used for "GRAB YOURS NOW" on gradient fields.
- **Ghost on dark:** transparent with a 1px white border at 50% alpha; hover fills with white at 14%.
- **Text link button:** underlined Muted Dusk text that turns Electric Ultramarine on hover.
- **Mini:** 6px 12px pill at 13px for admin row actions; danger variant on Status Red Wash.

### Chips
- **Style:** white pill, 1px Hairline Lavender border, 14px / 500 text, 9px 14px padding, wrapping in an 8px-gap row. The radio input is visually hidden inside.
- **State:** selected fills Electric Ultramarine with white text; keyboard focus shows the periwinkle ring on the chip.

### Cards / Containers
- **Corner Style:** 28px (24px on phones).
- **Background:** Paper White over the gradient field.
- **Shadow Strategy:** Deep lift (see Elevation).
- **Internal Padding:** 32px 28px.
- **Entrance:** rises 12px and fades in over 500ms on the system ease.
- **Info panel:** Mist Lavender, 18px radius, 14px 16px padding, with a small muted label above a 500-weight value.
- **Section divider inside a card:** 28px top margin, 24px padding, 1px #ECEDFA top border.

### Inputs / Fields
- **Style:** white, 1px Hairline Lavender border, 14px radius, 13px 15px padding, 16px text (never smaller, so iOS does not zoom).
- **Hover:** border shifts to #B7BAEE.
- **Focus:** border becomes Electric Ultramarine plus the 3px Focus halo; no outline.
- **Prefixed group:** a static prefix ("@", "+62") sits inside the same bordered shell; the shell takes the focus treatment.
- **PIN field:** 20px, centered, 0.5em letter-spacing, tabular numerals.
- **Error / Success:** a 14px message line below in Status Red or Status Green.

### Navigation
- **Landing nav:** brand (K mark plus "KR Solutions", 18px / 500) left; 15px links in On-Dark Lilac that turn white on hover; "Edit kartu" as a white-outlined pill. Under 820px only the brand and the pill remain.
- **Card brand:** K mark plus name in Midnight Ultramarine, 15px / 500, above the card content.

### Stat Tiles and Bars (signature)
Three equal tiles with a 1px #ECEDFA border, 16px radius, a Bricolage tabular number in Midnight Ultramarine over a 12px muted label. Below them, a 14-day bar plot: bars with a periwinkle-to-ultramarine vertical gradient and 6px top corners that grow from the bottom over 600ms, with a 10px day label beneath each.

### Activation Success Badge (signature)
A 64px Electric Ultramarine circle with a white check that pops in from 40% scale over 450ms, above a 26px headline and a Mist "keep this safe" panel.

## Do's and Don'ts

### Do:
- **Do** stage key moments (activation, edit, login, hero) as a white panel over the 165° ultramarine gradient with the upper-right Glow Violet lamp.
- **Do** use Electric Ultramarine for the one primary action per view and keep everything else neutral.
- **Do** tint every shadow with deep indigo and use a negative spread; give raised panels on light sections the Soft lift.
- **Do** keep inputs at 16px or larger and buttons full-width inside cards for thumb use on phones.
- **Do** show focus with the 3px Signal Periwinkle ring (offset 2 to 3px) on every interactive element.
- **Do** use tabular numerals for codes, PINs, and counts.
- **Do** wrap all motion in the reduced-motion override that disables animations and transitions.
- **Do** use the real product photos in `public/` for imagery, at 20 to 32px radius.

### Don't:
- **Don't** introduce a second brand hue; green and red are reserved for status.
- **Don't** use pure black text or grey shadows; text is Text Indigo Ink and shadows are indigo.
- **Don't** put dark panels on light fields; the relationship is always white on indigo.
- **Don't** use Inter above weight 500 or set body copy in Bricolage.
- **Don't** use square corners on interactive elements; buttons, chips, and tags are always pills.
