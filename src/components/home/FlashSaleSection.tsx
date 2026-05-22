'use client';

import { useEffect, useMemo, useState } from 'react';
import { Product } from '@/models/Product';
import { ProductCard } from '@/components/ui/ProductCard';
import { Activity, Clock3, Gauge, ShieldCheck, Zap } from 'lucide-react';

interface FlashSaleSectionProps {
  products: Product[];
}

function formatTime(seconds: number) {
  const safe = Math.max(seconds, 0);
  const h = String(Math.floor(safe / 3600)).padStart(2, '0');
  const m = String(Math.floor((safe % 3600) / 60)).padStart(2, '0');
  const s = String(safe % 60).padStart(2, '0');
  return { h, m, s };
}

export function FlashSaleSection({ products }: FlashSaleSectionProps) {
  const [remainSeconds, setRemainSeconds] = useState(2 * 3600 + 30 * 60);
  const flashProducts = useMemo(() => products.slice(0, 6), [products]);
  const soldPercent = 72;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainSeconds(prev => (prev <= 0 ? 2 * 3600 + 30 * 60 : prev - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = formatTime(remainSeconds);

  if (flashProducts.length === 0) return null;

  return (
    <section className="tech-card overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
      <div className="tech-shell p-4 text-white md:p-5 !bg-[#f26522]">
        <div className="relative z-[1] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="tech-glass flex h-12 w-12 items-center justify-center rounded-2xl">
              <Zap className="h-6 w-6 text-orange-100" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-orange-100">Flash Sale Engine</p>
              <p className="text-xs text-orange-100/90">Deal realtime, voucher tự áp dụng, số lượng có hạn</p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:min-w-[520px]">
            <div className="tech-glass rounded-2xl px-3 py-2">
              <p className="inline-flex  gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-100">
                <Clock3 size={13} /> Kết thúc sau
              </p>
              <div className="mt-1 flex items-center gap-1 text-sm font-black">
                <span className="rounded bg-white px-1.5 py-0.5 text-orange-600">{time.h}</span>
                <span>:</span>
                <span className="rounded bg-white px-1.5 py-0.5 text-orange-600">{time.m}</span>
                <span>:</span>
                <span className="rounded bg-white px-1.5 py-0.5 text-orange-600">{time.s}</span>
              </div>
            </div>
            <div className="tech-glass rounded-2xl px-3 py-2">
              <p className="inline-flex  gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-100">
                <Gauge size={13} /> Đã bán
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-orange-300" style={{ width: `${soldPercent}%` }} />
              </div>
              <p className="mt-1 text-xs font-semibold text-orange-100">{soldPercent}% lượt mua mục tiêu</p>
            </div>
            <div className="tech-glass rounded-2xl px-3 py-2">
              <p className="inline-flex  gap-1 text-[11px] font-bold uppercase tracking-wide text-orange-100">
                <ShieldCheck size={13} /> Bảo vệ đơn
              </p>
              <p className="mt-1 text-xs font-semibold text-orange-100">Thanh toán an toàn, đổi trả rõ ràng</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-orange-100 bg-orange-50 px-4 py-2">
        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-orange-700">
          <Activity size={14} /> Live deal feed
        </p>
        <a href="/search" className="text-xs font-bold text-orange-700 hover:text-orange-800">
          Xem tất cả
        </a>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-6">
        {flashProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
