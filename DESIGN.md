# Design Brief

## Direction

**Coastal Editorial** — A warm, inviting travel platform that combines the natural beauty of Kanyakumari's landscape with modern, accessible tourism guidance.

## Tone

Organic editorial warmth without skeuomorphism; a sophisticated travel magazine meets local guide aesthetic with genuine connection to place and culture.

## Differentiation

Strategic use of coastal color language (terracotta earth, ocean teal, sage green) with content-first editorial layouts that make tourist information feel curated, not transactional.

## Color Palette

| Token      | OKLCH         | Role                                    |
| ---------- | ------------- | --------------------------------------- |
| background | 0.96 0.015 75 | Warm cream foundation, approachable     |
| foreground | 0.2 0.03 50   | Deep warm brown text, high contrast     |
| card       | 0.98 0.01 75  | Slightly warmer card surfaces           |
| primary    | 0.45 0.12 30  | Terracotta/rust, tourism & action      |
| accent     | 0.5 0.12 200  | Ocean teal, coastal identity            |
| secondary  | 0.5 0.1 160   | Sage green, nature & environment        |
| destructive| 0.5 0.2 25    | Red, clear error/danger states          |

## Typography

- Display: Lora — warm editorial serif for headings and hero text, evokes travel guides
- Body: General Sans — modern, highly legible sans-serif for all UI and content
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Subtle shadow hierarchy: `surface-card` (1px, minimal) for content layers, `surface-elevated` (2px, gentle lift) for interactive elements; no harsh shadows, warm color-cast shadows reflect earth tones.

## Structural Zones

| Zone    | Background          | Border                 | Notes                                              |
| ------- | ------------------- | ---------------------- | -------------------------------------------------- |
| Header  | bg-card with border-b | border-border subtle  | Warm base with clear separation, navigation clear |
| Content | bg-background       | —                      | Cream base; alternate sections use bg-muted/5     |
| Sidebar | bg-card             | border-r border-border | Warm card treatment, sidebar-primary for active   |
| Footer  | bg-muted/40         | border-t border-border | Soft muted background, warm tone maintained       |

## Spacing & Rhythm

Spacious rhythm with section gaps of 3–4rem, content grouping within cards at 1.5–2rem, micro-spacing 0.25–0.5rem; card padding 1.5rem on mobile, 2rem on desktop for breathing room.

## Component Patterns

- Buttons: Terracotta primary (rounded-lg), ocean teal accent for secondary actions, sage green for success states; hover brightens via opacity
- Cards: rounded-lg, bg-card, surface-card shadow, border-border subtle 1px; tourist place cards span 1–3 columns mobile-first
- Badges: rounded-full, bg-primary/10 with text-primary for categories; bg-accent/10 with text-accent for status

## Motion

- Entrance: Staggered fade-in on page load (150ms per card) via `transition-smooth`
- Hover: 0.2s ease-out on interactive elements (buttons, cards, links) with slight lift via shadow change
- Decorative: None; interaction is conservative and purposeful

## Constraints

- No purple, violet, or cool blues; maintain warm earth/ocean palette only
- No full-width backgrounds; all sections respect container max-width for readability
- Shadows always warm-cast (via subtle chroma + hue); never cool grey shadows
- Hero content always pairs image + text; no text-only hero sections

## Signature Detail

Editorial cards with image-top layout, warm terracotta category badges, and ocean teal CTAs create a distinctive tourism-specific visual vocabulary that feels curated rather than generic.
