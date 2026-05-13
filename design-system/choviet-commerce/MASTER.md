# MASTER Design System — ChoViet Commerce

> Page-specific overrides live in `design-system/choviet-commerce/pages/<page-name>.md`.
> If no override exists, use this file and `design-system/MASTER.md` as the shared source of truth.

---

## Metadata

| Attribute | Value |
| --- | --- |
| Project | ChoViet Commerce |
| Industry | E-commerce Retail (B2C) |
| Reference | Shopee / Taobao style, adapted to orange high-tech commerce |
| Stack | Next.js + Tailwind CSS |
| Theme | High-tech Orange Commerce |

---

## Core Rule

- Primary color is fixed: `#F26522`.
- Supporting colors must be orange shades, white, black, or slate neutrals.
- Do not use purple, green, blue, cyan, magenta, or neon palettes as identity colors.
- UI must focus on products, conversion, vouchers, flash sale, cart actions, and product discovery.
- Avoid any marketplace/second-hand/rao-vat wording.

---

## Tokens

```css
:root {
  --brand: #f26522;
  --brand-500: #f26522;
  --brand-600: #d4521a;
  --brand-700: #b94714;
  --brand-100: #fff1eb;
  --brand-050: #fff7f3;

  --bg-page: #f6f6f6;
  --bg-card: #ffffff;
  --bg-elevated: #ffffff;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;

  --border-default: #e2e8f0;
  --border-soft: #f1f5f9;
}
```

---

## Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800&family=Rubik:wght@500;600;700;800&display=swap');
```

- Heading: `Rubik`
- Body and UI: `Nunito Sans`
- Product price: bold, orange, visually dominant.
- Product name: two-line clamp, readable at mobile density.
- Muted text must use at least `#475569` where readability matters.

---

## High-tech Utilities

The implementation lives in `src/app/globals.css`.

```css
.tech-shell
.tech-glass
.tech-card
.tech-chip
.tap-bounce
.add-cart-pulse
```

### Usage

- `tech-shell`: hero, flash sale header, dark high-tech footer.
- `tech-glass`: HUD metric panels and glass overlays.
- `tech-card`: product cards, promo tiles, trust cards, category tiles.
- `tech-chip`: quick search chips, product push labels, module tags.
- `tap-bounce`: tactile click/tap feedback.
- `add-cart-pulse`: short add-to-cart confirmation pulse.

---

## Homepage Rules

1. Hero must communicate ecommerce conversion, not company intro.
2. Banner supports product campaigns and vouchers.
3. Flash Sale must show countdown, progress, and visible product cards.
4. Category grid is a product discovery scanner, not a generic directory.
5. Product sections must prioritize:
   - price
   - voucher/deal
   - sold count
   - add-to-cart CTA
6. Use Product Boost Zone for promoted products and conversion metrics.

---

## Product Detail Rules

- Sticky actions and clear CTA hierarchy: `Mua ngay`, `Thêm vào giỏ`, `Lưu yêu thích`.
- Product module blocks should represent:
  - `vouchers`
  - `payments`
  - `returns`
  - `reviews`
  - `wish_list`
- Reviews must support trust and purchase confidence.
- Returns and payments blocks must reduce checkout anxiety.

---

## Component Specs

### Header

- Sticky top.
- Glass-like white header over orange/dark utility bar.
- Search remains visible.
- Quick search chips use `tech-chip`.
- Icon touch targets are at least `44px`.

### Footer

- Dark `tech-shell`.
- Shows trust modules before link columns.
- Uses orange/white/slate only.
- App buttons use `tech-glass`.

### Category Grid

- Header uses `tech-shell`.
- Category tiles use `tech-card`.
- Promo row focuses on deal, new arrivals, and freeship.

### Product Card

- Uses `product-card tech-card`.
- Add-to-cart button always visible.
- Do not hide important purchase actions behind hover.

---

## Accessibility

- All icon-only controls need `aria-label`.
- Focus state must be visible.
- Respect `prefers-reduced-motion`.
- No decorative infinite animations.
- No emoji as UI icons.

---

## Delivery Checklist

- [ ] `globals.css` tokens match this document.
- [ ] No purple/green/blue brand palette remains.
- [ ] Homepage focuses on products and product pushing.
- [ ] Product CTA is visible without hover.
- [ ] Flash sale and product sections use high-tech orange style.
- [ ] Category grid uses high-tech product discovery style.
- [ ] Header and footer match `High-tech Orange Commerce`.
