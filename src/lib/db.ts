// LIB: Mock Database
// In a real app, this would connect to PostgreSQL/MongoDB

import { Product, Category, Banner } from '@/models/Product';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Bất động sản', slug: 'bat-dong-san', icon: '🏠' },
  { id: '2', name: 'Xe cộ', slug: 'xe-co', icon: '🚗' },
  { id: '3', name: 'Đồ điện tử', slug: 'do-dien-tu', icon: '📱' },
  { id: '4', name: 'Thú cưng', slug: 'thu-cung', icon: '🐾' },
  { id: '5', name: 'Thời trang', slug: 'thoi-trang', icon: '👗' },
  { id: '6', name: 'Đồ gia dụng', slug: 'do-gia-dung', icon: '🛋️' },
  { id: '7', name: 'Việc làm', slug: 'viec-lam', icon: '💼' },
  { id: '8', name: 'Dịch vụ', slug: 'dich-vu', icon: '🔧' },
  { id: '9', name: 'Mẹ & Bé', slug: 'me-va-be', icon: '👶' },
  { id: '10', name: 'Thể thao', slug: 'the-thao', icon: '⚽' },
  { id: '11', name: 'Đồ ăn', slug: 'do-an', icon: '🍜' },
  { id: '12', name: 'Du lịch', slug: 'du-lich', icon: '✈️' },
];

export const BANNERS: Banner[] = [
  {
    id: '1',
    title: 'Flash Sale 6.6 - Giảm đến 50%',
    image: 'https://static.vecteezy.com/system/resources/previews/008/128/792/non_2x/6-6-logo-for-sale-poster-6-6-online-super-sale-banner-template-on-yellow-background-flash-sale-banner-design-vector.jpg',
    link: '/search?sort=popular',
  },
  {
    id: '2',
    title: 'Mở bán công nghệ mới - Voucher độc quyền',
    image: 'https://files.shopeeanalytics.com/upload/images/2022/06/01/shopee-6.6-sieu-sale-giua-nam-4.jpg',
    link: '/category/do-dien-tu',
  },
  {
    id: '3',
    title: 'Siêu deal gia dụng - Freeship toàn quốc',
    image: '/san_deal_gia_dung_v3.jpg',
    link: '/category/do-gia-dung',
  },
  {
    id: '4',
    title: 'Thời trang hè - Giảm thêm với mã GIAM30',
    image: '/thoi_trang_he.jpg',
    link: '/category/thoi-trang',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', title: 'iPhone 15 Pro Max 256GB Titanium Tự Nhiên, Còn BH 10 Tháng',
    price: 28500000, originalPrice: 33990000,
    image: 'https://picsum.photos/seed/iphone1/400/300',
    location: 'Quận 1, TP.HCM', category: 'Đồ điện tử', categorySlug: 'do-dien-tu',
    condition: 'used', postedAt: '2024-01-15', seller: 'Minh Tuấn', isUrgent: true,
    views: 1234,
  },
  {
    id: '2', title: 'Honda Wave Alpha 2022 Xanh Đen, Đi 8.000km, Xe Đẹp',
    price: 18500000, image: 'https://picsum.photos/seed/wave1/400/300',
    location: 'Đống Đa, Hà Nội', category: 'Xe cộ', categorySlug: 'xe-co',
    condition: 'used', postedAt: '2024-01-14', seller: 'Hoàng Linh', isFeatured: true,
    views: 892,
  },
  {
    id: '3', title: 'Laptop Dell XPS 13 9310 Core i7-1185G7, RAM 16GB, SSD 512GB',
    price: 22000000, originalPrice: 26000000,
    image: 'https://picsum.photos/seed/laptop1/400/300',
    location: 'Cầu Giấy, Hà Nội', category: 'Đồ điện tử', categorySlug: 'do-dien-tu',
    condition: 'used', postedAt: '2024-01-13', seller: 'Phúc Store', views: 567,
  },
  {
    id: '4', title: 'Phòng Trọ 25m² Quận 3, Full Nội Thất, Gần Chợ, An Ninh',
    price: 4500000, image: 'https://picsum.photos/seed/room1/400/300',
    location: 'Quận 3, TP.HCM', category: 'Bất động sản', categorySlug: 'bat-dong-san',
    condition: 'new', postedAt: '2024-01-15', seller: 'Thư Nhà Trọ', isUrgent: true,
    views: 2103,
  },
  {
    id: '5', title: 'Mèo Anh Lông Ngắn Màu Xám Xanh 3 Tháng Tuổi',
    price: 3500000, image: 'https://picsum.photos/seed/cat1/400/300',
    location: 'Tân Bình, TP.HCM', category: 'Thú cưng', categorySlug: 'thu-cung',
    condition: 'new', postedAt: '2024-01-12', seller: 'Trại Mèo ALS', views: 345,
  },
  {
    id: '6', title: 'Samsung Galaxy S24 Ultra 256GB Đen, Mua Tháng 12/2023',
    price: 25000000, originalPrice: 31990000,
    image: 'https://picsum.photos/seed/samsung1/400/300',
    location: 'Thủ Đức, TP.HCM', category: 'Đồ điện tử', categorySlug: 'do-dien-tu',
    condition: 'used', postedAt: '2024-01-11', seller: 'Tech Zone', views: 789,
  },
  {
    id: '7', title: 'Tủ Lạnh Samsung Inverter 382L Không Đóng Tuyết, Bảo Hành',
    price: 8900000, originalPrice: 12500000,
    image: 'https://picsum.photos/seed/fridge1/400/300',
    location: 'Hà Đông, Hà Nội', category: 'Đồ gia dụng', categorySlug: 'do-gia-dung',
    condition: 'used', postedAt: '2024-01-10', seller: 'Điện Lạnh Hùng', views: 456,
  },
  {
    id: '8', title: 'Quần Áo Nam Hàng Hiệu Auth: Zara, Mango, H&M Đủ Size',
    price: 250000, image: 'https://picsum.photos/seed/fashion1/400/300',
    location: 'Hoàn Kiếm, Hà Nội', category: 'Thời trang', categorySlug: 'thoi-trang',
    condition: 'used', postedAt: '2024-01-09', seller: 'Vintage Corner', views: 234,
  },
  {
    id: '9', title: 'Xe Đạp Thể Thao Giant ATX 810 2023, Còn Bảo Hành',
    price: 7500000, originalPrice: 9500000,
    image: 'https://picsum.photos/seed/bike1/400/300',
    location: 'Bình Thạnh, TP.HCM', category: 'Thể thao', categorySlug: 'the-thao',
    condition: 'used', postedAt: '2024-01-08', seller: 'Xe Đạp Tuấn', views: 321,
  },
  {
    id: '10', title: 'Căn Hộ 2PN Sunrise City 75m² View Đẹp, Nội Thất Cao Cấp',
    price: 5500000, image: 'https://picsum.photos/seed/apartment1/400/300',
    location: 'Quận 7, TP.HCM', category: 'Bất động sản', categorySlug: 'bat-dong-san',
    condition: 'new', postedAt: '2024-01-07', seller: 'BĐS Phú Quý', isFeatured: true,
    views: 1567,
  },
  {
    id: '11', title: 'iPad Pro M2 12.9 inch 128GB Wifi, Như Mới Kèm Apple Pencil',
    price: 19500000, originalPrice: 27990000,
    image: 'https://picsum.photos/seed/ipad1/400/300',
    location: 'Tân Phú, TP.HCM', category: 'Đồ điện tử', categorySlug: 'do-dien-tu',
    condition: 'used', postedAt: '2024-01-06', seller: 'iWorld Store', views: 678,
  },
  {
    id: '12', title: 'Chó Golden Retriever Thuần Chủng 2.5 Tháng Tuổi',
    price: 8000000, image: 'https://picsum.photos/seed/dog1/400/300',
    location: 'Long Biên, Hà Nội', category: 'Thú cưng', categorySlug: 'thu-cung',
    condition: 'new', postedAt: '2024-01-05', seller: 'Trại Chó TPHCM', views: 890,
  },
];

export const LOCATIONS = [
  'Toàn Quốc', 'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng',
  'Cần Thơ', 'Hải Phòng', 'Biên Hòa', 'Nha Trang',
];

export const POPULAR_SEARCHES = [
  'iPhone 15', 'xe máy điện', 'laptop gaming', 'thời trang nữ',
  'Samsung Galaxy', 'đồ gia dụng', 'máy lạnh', 'tủ lạnh',
];
