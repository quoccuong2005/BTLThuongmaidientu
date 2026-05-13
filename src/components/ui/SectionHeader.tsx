import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  icon?: ReactNode;
}

export function SectionHeader({ title, viewAllHref, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
        <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h2>
      </div>
      {viewAllHref && (
        <Link href={viewAllHref} className="group text-orange-500 hover:text-orange-600 text-sm font-bold flex items-center gap-1 transition-all">
          Xem tất cả
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
