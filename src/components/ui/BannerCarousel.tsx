'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/models/Product';

interface BannerCarouselProps {
  banners: Banner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(i => (i + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prev = () => setCurrent(i => (i - 1 + banners.length) % banners.length);
  const next = () => setCurrent(i => (i + 1) % banners.length);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-[16/5] md:aspect-[16/4] bg-gray-200">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center px-8">
              <div>
                <h3 className="text-white text-xl md:text-2xl font-bold">{banner.title}</h3>
                <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                  Xem ngay
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Nav arrows */}
        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-colors">
          <ChevronLeft size={18} className="text-gray-700" />
        </button>
        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 rounded-full shadow transition-colors">
          <ChevronRight size={18} className="text-gray-700" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-orange-500' : 'w-2 h-2 bg-white/60'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
