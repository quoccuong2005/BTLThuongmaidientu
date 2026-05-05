# ChợViệt - Next.js MVC E-commerce Platform

Clone của Chợ Tốt được xây dựng theo mô hình **MVC (Model-View-Controller)** với **Next.js 14 App Router**.

## 🏗️ Kiến trúc MVC

```
src/
├── models/              # MODEL LAYER
│   ├── Product.ts       # Định nghĩa kiểu dữ liệu Product, Category, etc.
│   └── User.ts          # Định nghĩa User model
│
├── controllers/         # CONTROLLER LAYER
│   ├── ProductController.ts  # Logic nghiệp vụ: tìm kiếm, lọc, format
│   └── CategoryController.ts # Logic danh mục
│
├── lib/
│   └── db.ts            # Mock database (thay bằng Prisma/MongoDB thật)
│
└── app/                 # VIEW LAYER (Next.js App Router)
    ├── page.tsx          # Trang chủ
    ├── search/page.tsx   # Trang tìm kiếm
    ├── product/[id]/     # Chi tiết sản phẩm
    ├── category/[slug]/  # Danh mục
    ├── post/page.tsx     # Đăng tin
    └── api/              # REST API endpoints
        ├── products/route.ts
        └── categories/route.ts
│
components/
├── layout/
│   ├── Header.tsx        # Thanh điều hướng trên
│   └── Footer.tsx        # Footer
├── ui/
│   ├── ProductCard.tsx   # Card sản phẩm (default + horizontal)
│   ├── CategoryGrid.tsx  # Lưới danh mục
│   ├── BannerCarousel.tsx # Slider banner
│   └── SectionHeader.tsx # Tiêu đề mỗi section
└── home/
    ├── TrustBadges.tsx   # Các badge tin tưởng
    └── QuickPostBanner.tsx # Banner kêu gọi đăng tin
```

## 🚀 Cài đặt & Chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 📋 Các trang

| Route | Mô tả |
|-------|-------|
| `/` | Trang chủ - banner, danh mục, sản phẩm nổi bật |
| `/search?q=...` | Tìm kiếm với bộ lọc |
| `/category/[slug]` | Sản phẩm theo danh mục |
| `/product/[id]` | Chi tiết sản phẩm |
| `/post` | Form đăng tin mới |
| `/api/products` | REST API - danh sách sản phẩm |
| `/api/categories` | REST API - danh sách danh mục |

## 🔌 Tích hợp dữ liệu thật

Để kết nối với Google Sheets hoặc database thật, thay đổi `src/lib/db.ts`:

```typescript
// Dùng Google Sheets API
import { google } from 'googleapis';
const sheets = google.sheets({ version: 'v4', auth });
const data = await sheets.spreadsheets.values.get({
  spreadsheetId: '1qnHp5UHPWW_cPkFwtnc0d-4PbopzryN2f6owpFQwDYY',
  range: 'Sheet1!A:Z',
});

// Hoặc dùng Prisma + PostgreSQL
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

## 🛠️ Tech Stack

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Be Vietnam Pro** - Font
