'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Loader2, ShoppingBag, Share2 } from 'lucide-react';

import { WishlistController } from '@/controllers/WishlistController';
import { ProductController } from '@/controllers/ProductController';

type Props = {
    params: {
        token: string;
    };
};

type PublicWishlistProduct = {
    id: number;
    product_line_id: number;
    product_line_name: string;
    name: string;
    sku: string;
    price: number;
    image_url: string;
    stock: number;
    is_out_of_stock: boolean;
};

type PublicWishlistItem = {
    id: number;
    wishlist_id: number;
    product_id: number;
    note: string | null;
    price_alert: boolean;
    stock_alert: boolean;
    added_at: string;
    product: PublicWishlistProduct;
};

type PublicWishlistResponse = {
    wishlist_name: string;
    items: PublicWishlistItem[];
    total: number;
    page: number;
    limit: number;
};

export default function PublicWishlistPage({ params }: Props) {
    const { token } = params;

    const [wishlist, setWishlist] = useState<PublicWishlistResponse | null>(null);
    const [items, setItems] = useState<PublicWishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPublicWishlist();
    }, [token]);

    const loadPublicWishlist = async () => {
        try {
            setIsLoading(true);

            const res = await WishlistController.getPublicWishlist(token);

            if (res) {
                setWishlist(res);
                setItems(res.items || []);
            } else {
                setWishlist(null);
                setItems([]);
            }
        } catch (error) {
            console.error(error);
            setWishlist(null);
            setItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!wishlist) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
                <div className="rounded-full bg-red-100 p-5">
                    <Heart className="h-10 w-10 text-red-500" />
                </div>

                <h1 className="mt-5 text-3xl font-black text-slate-900">
                    Link không tồn tại
                </h1>

                <p className="mt-3 max-w-md text-slate-500">
                    Danh sách yêu thích này có thể đã bị xóa hoặc link chia sẻ đã hết hạn.
                </p>

                <Link
                    href="/"
                    className="mt-6 rounded-2xl bg-[#FB6A01] px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
                >
                    Quay về trang chủ
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <section className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#FB6A01] to-rose-500 p-8 text-white shadow-2xl">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.22em]">
                                <Share2 size={14} />
                                Public Wishlist
                            </div>

                            <h1 className="mt-4 text-3xl font-black md:text-5xl">
                                {wishlist.wishlist_name}
                            </h1>

                            <p className="mt-3 text-sm text-orange-50">
                                Có {wishlist.total} sản phẩm trong danh sách chia sẻ này
                            </p>
                        </div>

                        <Link
                            href="/"
                            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-[#FB6A01] hover:bg-orange-50"
                        >
                            <ShoppingBag size={17} />
                            Mua sắm ngay
                        </Link>
                    </div>
                </section>

                <section className="mt-8">
                    {items.length === 0 ? (
                        <div className="flex min-h-[350px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-orange-200 bg-white text-center">
                            <div className="rounded-full bg-orange-100 p-5">
                                <Heart className="h-10 w-10 text-orange-500" />
                            </div>

                            <h2 className="mt-5 text-2xl font-black text-slate-900">
                                Chưa có sản phẩm nào
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Danh sách yêu thích này hiện chưa có sản phẩm.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {items.map(item => (
                                <Link
                                    key={item.id}
                                    href={`/product/${item.product.product_line_id}?variant=${item.product.id}`}
                                    className="group overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-orange-50">
                                        <img
                                            src={item.product.image_url || ''}
                                            alt={item.product.name}
                                            className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${item.product.is_out_of_stock ? 'opacity-50 grayscale' : ''
                                                }`}
                                        />

                                        {item.product.is_out_of_stock && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                                <span className="rounded-full bg-red-500 px-4 py-2 text-xs font-black text-white">
                                                    HẾT HÀNG
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5">
                                        <h3 className="line-clamp-2 text-lg font-black text-slate-900 transition group-hover:text-orange-600">
                                            {item.product.product_line_name}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.product.name}
                                        </p>

                                        <p className="mt-4 text-2xl font-black text-[#FB6A01]">
                                            {ProductController.formatPrice(item.product.price)}
                                        </p>

                                        <p className="mt-2 text-xs font-medium text-slate-500">
                                            Còn lại: {item.product.stock} sản phẩm
                                        </p>

                                        {item.note && (
                                            <div className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50 p-3 text-xs text-slate-600">
                                                {item.note}
                                            </div>
                                        )}

                                        <div className="mt-5">
                                            <div className="flex items-center justify-center rounded-2xl bg-[#FB6A01] px-4 py-3 text-sm font-black text-white transition hover:bg-orange-600">
                                                Xem sản phẩm
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}