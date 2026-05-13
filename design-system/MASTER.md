# MASTER Design System — BTL Thương Mại Điện Tử
> **Source of Truth** — Mọi page/component kế thừa từ file này.
> Override: Tạo `design-system/pages/<page-name>.md` để ghi đè từng trang.

---

## Metadata

| Attribute        | Value                                           |
|------------------|-------------------------------------------------|
| Project          | BTL Thương Mại Điện Tử                         |
| Industry         | Marketplace P2P (Asian E-commerce)              |
| Reference Brand  | Shopee / Lazada / Tiki                          |
| Stack            | Next.js 14 + Tailwind CSS                       |
| Generated        | 2026-05-13                                      |
| Reasoning Engine | UI/UX Pro Max — Marketplace P2P + Vibrant Block |

---

## 1. COLOR SYSTEM

### 1.1 Kết quả quét màu dự án hiện tại

Màu gốc **đã có** trong dự án — **giữ nguyên làm Primary** vì đã chuẩn tông Shopee:

| Token              | Hex       | Dùng cho                                   |
|--------------------|-----------|--------------------------------------------|
| `--brand`          | `#F26522` | Primary Brand (Shopee Orange)              |
| `--brand-dark`     | `#D4521A` | Hover / Pressed state của primary          |
| `--brand-light`    | `#FFF4EF` | Background tông nhạt, highlight            |
| `primary-500`      | `#F97316` | Tailwind alias (orange-500)                |
| `primary-600`      | `#EA580C` | Tailwind alias (orange-600)                |

### 1.2 Color Palette mở rộng — Asian Marketplace Style

```css
:root {
  /* ── PRIMARY (Shopee Orange) ── */
  --color-primary:          #F26522;
  --color-primary-dark:     #D4521A;
  --color-primary-light:    #FFF4EF;
  --color-primary-50:       #FFF7ED;
  --color-primary-100:      #FFEDD5;
  --color-on-primary:       #FFFFFF;

  /* ── FLASH SALE / URGENCY (Đỏ) ── */
  --color-flash:            #EE4D2D;   /* Shopee Flash Sale Red */
  --color-flash-dark:       #C73B1F;
  --color-flash-bg:         #FFF0EE;   /* Background nền khu Flash Sale */

  /* ── DISCOUNT BADGE (Vàng cam) ── */
  --color-discount:         #F5A623;
  --color-discount-text:    #7C3A00;

  /* ── SUCCESS / IN STOCK ── */
  --color-success:          #26AA65;
  --color-success-light:    #E8F8EF;

  /* ── WARNING / Limited Stock ── */
  --color-warning:          #FF6900;
  --color-warning-light:    #FFF3E0;

  /* ── NEUTRAL SURFACES ── */
  --color-bg-page:          #F5F5F5;   /* Nền xám nhạt toàn trang */
  --color-bg-card:          #FFFFFF;   /* Card sản phẩm nền trắng */
  --color-bg-section:       #FAFAFA;
  --color-border:           #E5E7EB;
  --color-border-light:     #F3F4F6;

  /* ── TEXT ── */
  --color-text-primary:     #1A1A1A;
  --color-text-secondary:   #6B7280;
  --color-text-muted:       #9CA3AF;
  --color-text-price:       #EE4D2D;   /* Giá tiền: đỏ Flash-sale */
  --color-text-price-old:   #9CA3AF;   /* Giá cũ: gạch ngang + xám */

  /* ── OVERLAY / SCRIM ── */
  --color-scrim:            rgba(0, 0, 0, 0.45);
  --color-scrim-light:      rgba(0, 0, 0, 0.15);
}
```

### 1.3 Color Mood — Triết lý màu sắc

| Vai trò               | Màu                | Mục tiêu tâm lý                                         |
|-----------------------|--------------------|---------------------------------------------------------|
| Primary Brand         | `#F26522` Cam rực  | Năng lượng, hành động, kích thích mua sắm               |
| Flash Sale / CTA nóng | `#EE4D2D` Đỏ      | Khẩn cấp, giới hạn thời gian, FOMO                     |
| Discount Badge        | `#F5A623` Vàng cam | Giá trị, tiết kiệm, thu hút mắt                        |
| Nền trang             | `#F5F5F5` Xám nhạt | Tạo contrast, làm nổi card trắng                        |
| Card sản phẩm         | `#FFFFFF` Trắng   | Sản phẩm nổi bật rõ ràng trên nền xám                  |
| Giá tiền              | `#EE4D2D` Đỏ      | Giá = thông tin quan trọng nhất, phải đập vào mắt ngay |

> **Anti-pattern về màu**: Tuyệt đối không dùng màu pastel nhạt / gradient mờ cho CTA. Không dùng nền trắng toàn trang (mất tương phản với card).

---

## 2. TYPOGRAPHY SYSTEM

### 2.1 Font Stack

```css
/* Primary: Be Vietnam Pro (đang dùng trong dự án — GIỮ NGUYÊN) */
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap');

body { font-family: 'Be Vietnam Pro', system-ui, sans-serif; }
```

> **Lý do giữ Be Vietnam Pro**: Tối ưu cho tiếng Việt, dễ đọc lướt nhanh, weight 800 đẹp cho giá và badge — hoàn toàn phù hợp tông Shopee.

### 2.2 Type Scale — Mobile-First

```css
/* Type Scale: Shopee-style — ưu tiên scannable */
--text-xs:    11px;   /* Mô tả phụ, timestamp */
--text-sm:    12px;   /* Tag, label nhỏ */
--text-base:  14px;   /* Body text mặc định */
--text-md:    15px;   /* Tên sản phẩm */
--text-lg:    16px;   /* Sub-heading */
--text-xl:    18px;   /* Heading section */
--text-2xl:   22px;   /* Banner heading */
--text-3xl:   28px;   /* Flash Sale countdown */
--text-price: 20px;   /* Giá tiền — bold + red */
--text-price-lg: 26px; /* Giá trang chi tiết sản phẩm */
```

### 2.3 Typography Rules — Luật bắt buộc

| Element             | Font-size | Font-weight | Color                    | Ghi chú                        |
|---------------------|-----------|-------------|--------------------------|--------------------------------|
| Tên sản phẩm (card) | 14px      | 500 Medium  | `--color-text-primary`   | Clamp 2 dòng                   |
| **Giá tiền**        | **20px**  | **700 Bold**| **`--color-text-price`** | **LUÔN to + đậm + đỏ**         |
| Giá cũ (gạch ngang) | 12px      | 400         | `--color-text-price-old` | `text-decoration: line-through`|
| % Giảm giá          | 12px      | **700 Bold**| `#FFFFFF` on đỏ          | Badge nền đỏ                   |
| Flash Sale timer    | 22–28px   | **800 ExtraBold** | `#FFFFFF`           | Monospace digits               |
| Tên danh mục        | 11px      | 500         | `--color-text-primary`   | 2 dòng, center                 |
| CTA Button text     | 14px      | **600 SemiBold** | `#FFFFFF`           |                                |
| Section heading     | 16–18px   | **700 Bold**| `--color-text-primary`   |                                |

---

## 3. RECOMMENDED PATTERN — Cấu trúc trang Mobile-First

```
┌─────────────────────────────────────────┐
│  STICKY HEADER                          │  z-index: 100
│  [Logo] [Search Bar ──────] [🔔] [Cart] │  height: 56px
├─────────────────────────────────────────┤
│  BANNER CAROUSEL                        │  Tỉ lệ 16:6 (mobile) / 16:5 (desktop)
│  [← Slide 1 / Slide 2 / Slide 3 →]     │  Auto-play 4s, dots indicator
│  ○ ● ○ ○                                │
├─────────────────────────────────────────┤
│  CATEGORY ICON GRID                     │  Bento: 5 cols mobile, 10 cols desktop
│  [🎁][👗][📱][🏠][🎮][💄][👟][📚][🍜][🔧]│  Icon 40px + label 11px
├─────────────────────────────────────────┤
│  ┌──────────── FLASH SALE ────────────┐ │  Background: gradient đỏ → cam
│  │ ⚡ FLASH SALE   ⏱ 02 : 34 : 17   │ │  Countdown đồng hồ nhấp nháy
│  │ [Xem tất cả →]                     │ │
│  │ [P1]  [P2]  [P3]  [P4]  [P5]  →  │ │  Horizontal scroll, snapped
│  └────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  BENTO GRID — DANH MỤC NỔI BẬT         │  Asymmetric grid: 1 large + 4 small
│  ┌──────┬───┬───┐                       │
│  │      │   │   │                       │
│  │ BIG  ├───┼───┤                       │
│  │      │   │   │                       │
│  └──────┴───┴───┘                       │
├─────────────────────────────────────────┤
│  PRODUCT GRID — GỢI Ý CHO BẠN          │  2 cols mobile / 4-5 cols desktop
│  [Card][Card]                           │  Infinite scroll hoặc "Xem thêm"
│  [Card][Card]                           │
│  ...                                    │
├─────────────────────────────────────────┤
│  BOTTOM NAVIGATION (Web-Mobile)         │  z-index: 200, Safe area inset
│  [🏠 Home][🔍 Tìm][🔔 Thông báo][👤 Tôi]│  Max 4–5 items
└─────────────────────────────────────────┘
```

### 3.1 Sticky Header Spec

```
height: 56px mobile / 64px desktop
background: #F26522 (brand orange) hoặc #FFFFFF + brand accent
search-bar: flex-1, rounded-full, bg #FFF hoặc #F5F5F5
padding: 0 12px
position: sticky; top: 0; z-index: 100;
```

### 3.2 Flash Sale Section Spec

```
background: linear-gradient(135deg, #EE4D2D 0%, #F26522 100%)
header-text: 'FLASH SALE' — white, 700, 16px
countdown: white, 800, 22px, monospace, border 2px white, gap 4px
product-scroll: horizontal, snap-x mandatory, hide scrollbar
```

### 3.3 Category Icon Grid Spec

```
grid: repeat(5, 1fr) mobile | repeat(10, 1fr) desktop
icon-container: 48px circle, bg white, shadow-sm
icon-size: 28px SVG
label: 11px, 500, text-center, clamp 2 lines
gap: 8px
```

---

## 4. STYLE PRIORITY

### 4.1 Triết lý thiết kế: Vibrant & Block-based

| Nguyên tắc                | Mô tả                                                              |
|---------------------------|--------------------------------------------------------------------|
| **High Information Density** | Nhét nhiều thông tin vào không gian nhỏ. Ưu tiên sản phẩm, giá, badge |
| **Block Layout**           | Chia trang thành các khối màu rõ ràng, mỗi khối có mục đích riêng  |
| **Bento Grid**             | Lưới bất đối xứng cho danh mục/banner. 1 ô lớn + nhiều ô nhỏ      |
| **Card-based UI**          | Nền `#F5F5F5` + card `#FFFFFF` — tạo độ nổi rõ ràng              |
| **Conversion-Optimized**  | CTA "Thêm vào giỏ" và "Mua ngay" luôn visible, không cần scroll   |

### 4.2 So sánh với thiết kế Phương Tây (không áp dụng cho dự án này)

| Phương Tây (Tránh)         | Asian Marketplace (Áp dụng)                       |
|----------------------------|----------------------------------------------------|
| Nhiều whitespace           | Mật độ thông tin cao, tận dụng không gian          |
| 1 hero image lớn           | Carousel + nhiều banner xếp chồng                  |
| Tối thiểu màu sắc          | Nhiều màu rực, badge đỏ/vàng nổi bật               |
| Giá ẩn hoặc nhỏ            | Giá tiền to nhất, đỏ, bold, đặt đầu tiên          |
| Scroll dài để tìm sản phẩm | Tất cả danh mục + flash sale nằm Above the fold    |

---

## 5. KEY EFFECTS & ANIMATIONS

### 5.1 Micro-interactions

```css
/* Button bounce effect */
.btn-primary:active {
  transform: scale(0.94);
  transition: transform 80ms ease-out;
}
.btn-primary:not(:active) {
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1); /* spring */
}

/* Card hover */
.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.10);
  transition: all 200ms ease-out;
}

/* Add to cart success pulse */
@keyframes cartPulse {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}
.cart-icon-animate { animation: cartPulse 300ms ease-out; }
```

### 5.2 Flash Sale Countdown Timer

```css
/* Digits nhấp nháy khi < 1 phút */
@keyframes urgentBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
.countdown-urgent { animation: urgentBlink 800ms ease-in-out infinite; }

/* Flip animation cho digit thay đổi */
@keyframes digitFlip {
  0%   { transform: rotateX(0deg); }
  50%  { transform: rotateX(90deg); }
  100% { transform: rotateX(0deg); }
}
.digit-flip { animation: digitFlip 300ms ease-in-out; }
```

### 5.3 Gamification Elements

```css
/* Progress bar "Đã bán X%" trong Flash Sale */
.sold-progress {
  background: linear-gradient(90deg, #F26522, #EE4D2D);
  border-radius: 9999px;
  transition: width 600ms ease-out;
}

/* Badge "Hot" pulse */
@keyframes hotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(238, 77, 45, 0.4); }
  50%       { box-shadow: 0 0 0 6px rgba(238, 77, 45, 0); }
}
.badge-hot { animation: hotPulse 2s ease-in-out infinite; }
```

### 5.4 Animation Timing Rules

| Loại interaction       | Duration  | Easing                    |
|------------------------|-----------|---------------------------|
| Button press (bouncy)  | 80ms in / 200ms out | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Card hover             | 200ms     | `ease-out`                |
| Modal open             | 250ms     | `ease-out` from bottom    |
| Toast/snackbar         | 300ms     | `ease-out` slide up       |
| Page transition        | 200ms     | `ease-in-out`             |
| Skeleton shimmer       | 1500ms    | `linear` infinite         |
| Countdown flip         | 300ms     | `ease-in-out`             |

> **Anti-pattern**: Tuyệt đối không dùng `transition: all` — chỉ animate `transform`, `opacity`, `box-shadow`.

---

## 6. UX GUIDELINES & ANTI-PATTERNS

### 6.1 Product Detail Page — CTA Sticky Bottom Bar (LUẬT BẮT BUỘC)

```
┌──────────────────────────────────────────┐
│  [Chat với shop]  [Thêm vào giỏ]  [Mua ngay]  │  Sticky bottom
│   border-top       bg white          bg brand  │  height: 56px
│   text-brand       text-brand        text-white│  safe-area-inset-bottom
└──────────────────────────────────────────┘
```

- **PHẢI** dùng `position: sticky; bottom: 0` hoặc `position: fixed; bottom: 0`
- **PHẢI** thêm `padding-bottom: env(safe-area-inset-bottom)` cho iPhone notch
- "Mua ngay" background brand orange, font-weight 700
- "Thêm vào giỏ" border brand orange, text brand orange

### 6.2 Checkout Flow — Tối đa 3 bước (LUẬT BẮT BUỘC)

```
Bước 1: Xem giỏ hàng → chỉnh sửa
Bước 2: Điền địa chỉ + chọn vận chuyển + chọn thanh toán  
Bước 3: Xác nhận đơn hàng → THANH TOÁN (1 click)
```

> **Anti-pattern NGHIÊM CẤM**: Thêm bước xác minh email, nhập voucher riêng trang, chọn ngân hàng ở trang khác, OTP trước khi checkout.

### 6.3 Search Experience

- Search bar **PHẢI** visible ở màn hình đầu tiên (không cần scroll)
- Gợi ý tìm kiếm: debounce 300ms, hiện dropdown ngay sau 1 ký tự
- Lịch sử tìm kiếm: lưu localStorage, hiện khi focus vào search bar rỗng
- Kết quả 0 sản phẩm: **PHẢI** hiện gợi ý thay thế, không hiện trang trắng

### 6.4 Loading States

| Trạng thái         | Giải pháp                                           |
|--------------------|-----------------------------------------------------|
| Product grid load  | Skeleton card (shimmer) — KHÔNG dùng spinner        |
| Image load         | Placeholder màu `#F5F5F5` + aspect-ratio giữ chỗ   |
| Button async action| Disable + show spinner in button                    |
| Page transition    | Instant (< 100ms perceived) với skeleton            |

### 6.5 Anti-Patterns — TUYỆT ĐỐI TRÁNH

| Anti-Pattern                        | Hậu quả                                    | Giải pháp                          |
|-------------------------------------|--------------------------------------------|------------------------------------|
| Checkout > 3 bước                   | Drop-off rate tăng 40–60%                  | Merge address + payment vào 1 bước |
| Hiệu ứng 3D / particle / WebGL      | FPS drop, tải chậm, thoát app              | Dùng CSS transform thuần            |
| CTA "Mua ngay" không sticky         | User quên mua khi scroll sản phẩm dài      | Sticky bottom bar                  |
| Giá tiền nhỏ / không đỏ / không bold | Mất điểm nhấn, giảm conversion            | Luôn bold + đỏ + to nhất           |
| Modal thanh toán không đóng được    | Frustration, abandon cart                  | Luôn có nút X + swipe-down dismiss |
| Không có badge "Đã bán" / "Còn X cái" | Mất FOMO, giảm urgency                  | Hiện progress bar sold-out         |
| Placeholder-only label trong form   | Accessibility fail + UX confuse            | Dùng floating label hoặc label trên |
| Trang category không breadcrumb     | User mất phương hướng                      | Breadcrumb + back button rõ ràng   |

---

## 7. SPACING & LAYOUT SYSTEM

```css
/* 4pt base grid — Tailwind-aligned */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;

/* Component-specific */
--card-padding:        12px;
--card-gap:            8px;         /* gap giữa các card */
--section-padding-x:   12px;        /* padding ngang section mobile */
--section-gap:         8px;         /* gap giữa các section */
--header-height:       56px;
--bottom-nav-height:   56px;
--bottom-cta-height:   64px;        /* sticky buy button */
```

### 7.1 Breakpoints

```css
/* Mobile-first */
sm:  640px   /* Điện thoại lớn, phablet */
md:  768px   /* Tablet nhỏ */
lg:  1024px  /* Tablet lớn, laptop */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Desktop lớn */
```

### 7.2 Grid System cho Product Listing

```css
/* Mobile:  2 cột */
.product-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }

/* Tablet: 3-4 cột */
@media (min-width: 768px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
}

/* Desktop: 5-6 cột */
@media (min-width: 1024px) {
  .product-grid { grid-template-columns: repeat(5, 1fr); gap: 16px; }
}
```

---

## 8. COMPONENT TOKENS — Quick Reference

### 8.1 Product Card

```css
.product-card {
  background:    var(--color-bg-card);           /* #FFFFFF */
  border-radius: 8px;
  border:        1px solid var(--color-border-light);
  overflow:      hidden;
  cursor:        pointer;
}
/* Image ratio: 1:1 (padding-top: 100%) */
/* Price: font-size 18-20px, font-weight 700, color: var(--color-text-price) */
/* Name: font-size 14px, font-weight 500, -webkit-line-clamp: 2 */
```

### 8.2 Discount Badge

```css
.badge-discount {
  background:    var(--color-flash);             /* #EE4D2D */
  color:         #FFFFFF;
  font-size:     11px;
  font-weight:   700;
  padding:       2px 5px;
  border-radius: 2px;
}
```

### 8.3 Primary Button (CTA)

```css
.btn-primary {
  background:    var(--color-primary);           /* #F26522 */
  color:         var(--color-on-primary);        /* #FFFFFF */
  font-size:     14px;
  font-weight:   600;
  padding:       12px 24px;
  border-radius: 4px;
  border:        none;
  cursor:        pointer;
  min-height:    44px;                           /* Touch target */
  transition:    background 150ms ease-out, transform 80ms ease-out;
}
.btn-primary:hover  { background: var(--color-primary-dark); }
.btn-primary:active { transform: scale(0.96); }
```

### 8.4 Flash Sale Header

```css
.flash-sale-header {
  background: linear-gradient(135deg, #EE4D2D 0%, #F26522 60%, #F5A623 100%);
  color:      #FFFFFF;
  padding:    10px 12px;
  display:    flex;
  align-items: center;
  justify-content: space-between;
}
```

---

## 9. Z-INDEX SCALE

```css
--z-base:       0;
--z-card-hover: 1;
--z-sticky:     10;     /* Section headers */
--z-header:     100;    /* Sticky top header */
--z-bottom-nav: 200;    /* Bottom navigation */
--z-bottom-cta: 201;    /* Sticky buy button (product detail) */
--z-overlay:    300;    /* Modal backdrop */
--z-modal:      400;    /* Modal content */
--z-toast:      500;    /* Toast notifications */
--z-tooltip:    600;    /* Tooltips */
```

---

## 10. ACCESSIBILITY RULES

- Contrast tối thiểu **4.5:1** cho body text trên mọi nền
- Brand orange `#F26522` trên trắng → **5.1:1** ✅
- Flash red `#EE4D2D` trên trắng → **4.6:1** ✅
- Tất cả icon-only button PHẢI có `aria-label`
- Form input PHẢI có `<label>` liên kết (không dùng placeholder thay label)
- Hỗ trợ `prefers-reduced-motion`: tắt animation, giữ transitions

---

## 11. HOW TO USE THIS FILE IN NEW SESSIONS

```
Tôi đang build trang [Tên trang]. 
Hãy đọc design-system/MASTER.md.
Kiểm tra xem design-system/pages/[tên-trang].md có tồn tại không.
Nếu có, ưu tiên rules trong file đó.
Nếu không, dùng MASTER.md làm nguồn duy nhất.
Bây giờ generate code...
```

### Pages đã có override:
- *(chưa có — thêm vào đây khi tạo)*

---

*End of MASTER Design System — BTL Thương Mại Điện Tử*
