'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Banner } from '@/models/Product';

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (banners.length === 0) return;
    // const timer = setInterval(() => {
    //   setCurrent(i => (i + 1) % banners.length);
    // }, 4000);
    // return () => clearInterval(timer);
  }, [banners.length]);

  const prev = () => setCurrent(i => (i - 1 + banners.length) % banners.length);
  const next = () => setCurrent(i => (i + 1) % banners.length);

  if (banners.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white">
        <div className="aspect-[16/7] md:aspect-[11/5] flex items-center justify-center text-sm text-slate-500">
          Chưa có banner để hiển thị
        </div>
      </div>
    );
  }

  return (
    <div className="tech-card relative rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white">
      <div className="relative aspect-[16/7] md:aspect-[11/5] bg-gray-200">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          >
            {!failedImages[banner.id] ? (
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
                onError={() => setFailedImages(prev => ({ ...prev, [banner.id]: true }))}
              />
            ) : (
              <div className="h-full w-full bg-orange-50" />
            )}
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10 flex items-center px-4 md:px-8">
              <div>
                <p className="mb-2 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-100 backdrop-blur">
                  Smart campaign
                </p>
                <h3 className="text-white text-base md:text-2xl font-bold max-w-xl leading-tight">{banner.title}</h3>
                <Link
                  href={banner.link}
                  className="mt-3 inline-flex min-h-10 items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
                >
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Nav arrows */}
        <button onClick={prev} aria-label="Banner trước" className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-1.5 rounded-full shadow transition-colors">
          <ChevronLeft size={18} className="text-gray-700" />
        </button>
        <button onClick={next} aria-label="Banner kế tiếp" className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/85 hover:bg-white p-1.5 rounded-full shadow transition-colors">
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Đến banner ${i + 1}`}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-white/60'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
