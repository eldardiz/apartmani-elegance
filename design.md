# Design System — Apartmani Elegance

Extracted from homepage CSS/HTML. Use this as the reference for all new pages and components.

---

## Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-dark` | `#070707` | Page background, dark sections |
| `--gold` | `#b98b2c` / `#b8924f` | Primary accent (buttons, links, borders) |
| `--gold-hover` | `#856013` | Gold button hover state |
| `--cream` | `#fff5ea` | Primary text on dark backgrounds |
| `--orange` | `#E05C1B` | Calendar accent, contact CTA, booked-date indicator |
| `--orange-dark` | `#b8460f` | Orange hover |
| `--ink` | `#1a1a1a` | Body text on light backgrounds |
| `--muted` | `#6b6b6b` | Secondary text, captions |
| `--line` | `#e7e2d8` | Borders, dividers on light backgrounds |
| `--surface` | `#faf8f3` | Light section background (calendar, blog prose) |
| `--surface-warm` | `#f0ebe0` | Contact form section background |
| `--booked-red` | `#e7503f` | Booked date indicator |

---

## Typography

### Fonts (loaded via WebFont.load)
- **Playfair Display** — Headings (h1, h2, blog titles). Weights: 400, 600, 700, 800.
- **Josefin Sans** — Buttons, nav links, labels. Weights: 100–700.
- **Open Sans** — Body copy, form fields, captions. Weights: 300–800.
- **Lato** — Utility text, counters. Weights: 100–900.

### Scale

| Element | Style |
|---|---|
| `h1` | Playfair Display, `clamp(32px, 5vw, 60px)`, weight 700, color `#fff5ea` on dark |
| `h2` | Playfair Display, `clamp(24px, 4vw, 40px)`, weight 700 |
| `h3` | Playfair Display, `clamp(20px, 3vw, 28px)`, weight 600 |
| Body | Open Sans, 16–18px, line-height 1.7 |
| Caption / meta | Open Sans, 13–14px, color `#6b6b6b` |
| Button text | Josefin Sans, 16px, weight 700 |
| Nav links | Josefin Sans, weight 400 |

---

## Spacing

| Pattern | Value |
|---|---|
| Section padding (standard) | `padding: 72px 5vw` |
| Section padding (compact) | `padding: 48px 5vw` |
| Container max-width | ~1200px via `.container` / `.container-2` |
| Inner content max-width | 740–980px |

---

## Components

### Navbar
- Class: `.navbar.second.w-nav`
- Fixed top, dark background `#070707`, Josefin Sans links
- Always includes `.yellow-button.navbar-yellow-button` linking to `rezervacija.html`
- Booking.com logo link in nav right side
- Hamburger `.menu-button.w-nav-button` for mobile

### Buttons

| Variant | Class | Style |
|---|---|---|
| Gold (primary) | `.yellow-button` | `background #b98b2c`, white text, radius 999px, Josefin Sans 700 |
| Gold hover | — | `background #856013` |
| Pill ghost | `.button-secondary` (if needed) | border `#b98b2c`, transparent bg |
| WhatsApp | `.ael-cal__btn--wa` | `background #25D366`, dark green text |
| Orange email | `.ael-cal__btn--mail` | `background #E05C1B`, white text |

### Section pattern
```html
<section class="all-section [name]-section">
  <div class="container-2">
    <!-- content -->
  </div>
</section>
```

### Cards (apartment cards)
- White background, `border-radius: 12–16px`, `border: 1px solid #e7e2d8`
- Hover: slight lift + gold border

### Footer
- Dark `#070707` background, cream text
- 6-column grid: brand | Sekcije | Apartmani | Vodiči | Kontakt | Platforme
- Logo: `images/footer-logo.svg`
- Copyright: `© 2026 Apartmani Elegance x Eldar Dizdarević`

---

## Rules

1. **No em dashes (—)** in any user-facing copy. Use commas, parentheses, or restructure.
2. **`lang="bs"`** on every HTML page.
3. **Canonicals** always `https://apartmanielegance.ba/...` (apex, HTTPS, no trailing slash on inner pages).
4. **Internal links**: relative paths or apex-HTTPS. Never `vercel.app`.
5. **Images**: `/images/...` relative from root (or `../images/` from `blog/`). Never Webflow CDN URLs in new pages.
6. **Bosnian first.** All copy is Bosnian. No English on user-facing text.
7. **Copy tone**: warm, factual, locally specific (mention Tuzla, Donji Mosnik, Panonska jezera, konkretne udaljenosti). AI engines cite concrete facts.
