# MASTER Design System — E-commerce Asian Layout

> Source of truth cho toàn bộ UI dự án.
> Nếu có `design-system/pages/<page>.md` thì page rules override file này.

---

## 1) Quy tắc tối cao

- Chỉ dùng **một màu thương hiệu chủ đạo**: `#F26522`.
- Mọi màu phụ phải là **biến thể của cam** (shade/tint/alpha) hoặc neutral (đen/trắng/xám).
- Loại bỏ tư duy rao vặt/chợ: ưu tiên retail conversion (giá, giảm giá, thêm giỏ, mua ngay).
- Bố cục ưu tiên **mobile-first, mật độ thông tin cao**.

---

## 2) Color Tokens (Orange-first)

```css
:root {
  --brand-500: #f26522;    /* Primary */
  --brand-600: #d4521a;    /* Hover/pressed */
  --brand-700: #b94714;    /* High emphasis */
  --brand-100: #fff1eb;    /* Soft surface */
  --brand-050: #fff7f3;    /* Light background */

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

### Cấm dùng

- Không dùng palette tím/xanh làm identity.
- Không dùng gradient nhiều màu ngoài hệ cam + neutral.

---

## 3) Typography mới

```css
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700;800&family=Rubik:wght@500;600;700;800&display=swap');
```

- Heading: `Rubik`
- Body/UI: `Nunito Sans`
- Quy tắc:
  - Giá sản phẩm: bold, nổi bật nhất trong card.
  - Section title: ngắn, rõ mục đích mua hàng.
  - Text phụ tối thiểu `#475569` để đảm bảo contrast.

---

## 4) Layout chuẩn Asian Commerce

1. Sticky Header (2 tầng: utility + search/actions)
2. Banner/Promo Grid dạng block
3. Category Bento Grid (danh mục + promo tile)
4. Flash Sale / Sản phẩm nổi bật
5. Gợi ý sản phẩm mật độ cao
6. Bottom Navigation cố định trên mobile

---

## 5) High-tech Orange Commerce Theme

Đây là theme hiện tại đã được duyệt cho dự án.

- Tên nội bộ: `High-tech Orange Commerce`.
- Cảm giác: HUD/FUI nhẹ, glassmorphism, commerce dashboard, realtime deal.
- Không dùng neon xanh/tím làm màu nhận diện; mọi glow/line/chip đều xoay quanh cam `#F26522`, trắng và slate.
- Hiệu ứng dùng vừa đủ: hover glow, edge highlight, glass panel, grid pattern. Không dùng animation loop trang trí liên tục.

### Utility classes chủ đạo

```css
.tech-shell   /* nền tối + orange glow + grid HUD */
.tech-glass   /* glass panel có blur/depth */
.tech-card    /* card có edge glow nhẹ khi hover */
.tech-chip    /* chip cam nhạt cho keyword/module/status */
```

### Component mapping

- Hero: `tech-shell` + `tech-glass`, hiển thị live commerce/realtime deal.
- Header: sticky glass header, search bar luôn visible, quick chips dạng `tech-chip`.
- Flash Sale: gradient cam/tối, countdown dạng module, progress đã bán.
- Product Card: card trắng, edge glow nhẹ, CTA cam, micro-interaction khi thêm giỏ.
- Footer: dark tech surface, brand orange, module/trust signals rõ ràng.

---

## 6) Component Rules

### Header

- Sticky top, luôn giữ search bar visible.
- Icon action min touch target `44x44`.
- Quick keyword chips cuộn ngang.

### Product Card

- Card dày thông tin: ảnh, tên, giá, đã bán, rating, vị trí.
- Có nút `Thêm vào giỏ` ngay trên card.
- Hover nhẹ (shadow + translateY), click có bounce nhẹ.

### Category Grid

- 4 cột mobile, 6–8 cột desktop.
- Icon thống nhất SVG (Lucide / image URL hợp lệ).
- Có promo blocks kiểu bento ngay dưới lưới danh mục.

### Bottom Navigation

- Chỉ hiện mobile (`< md`), fixed bottom.
- 4 mục chính: Trang chủ, Danh mục, Giỏ hàng, Tài khoản.

---

## 7) Micro-interactions

```css
.tap-bounce:active {
  transform: scale(0.96);
}

.add-cart-pulse {
  animation: addCartPulse 260ms ease-out;
}

@keyframes addCartPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}
```

- Duration chính: `150–250ms`.
- Ưu tiên animate `transform`, `opacity`, `box-shadow`.

---

## 8) UX định hướng Conversion

- CTA chính luôn nhìn thấy trong viewport đầu.
- Giá + giảm giá + đã bán phải nằm ở nửa trên card.
- Không phụ thuộc hover cho hành vi chính.
- Search/action ưu tiên cho thao tác một tay trên mobile.

---

## 9) Accessibility bắt buộc

- Contrast text body >= 4.5:1.
- Tất cả icon-only button có `aria-label`.
- Có `focus-visible` cho link/button/input.
- Hỗ trợ `prefers-reduced-motion`.

---

## 10) Checklist bàn giao

- [ ] Chỉ dùng primary cam và neutral
- [ ] Không còn wording theo tư duy rao vặt/chợ
- [ ] Header sticky + bottom nav mobile hoạt động
- [ ] Lưới banner/danh mục dạng block-bento
- [ ] Nút thêm giỏ có micro-interaction
- [ ] Không emoji icon trong UI chính
- [ ] Responsive tốt tại 375 / 768 / 1024 / 1440
