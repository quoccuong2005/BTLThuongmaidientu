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
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2">
        {icon && <span className="text-orange-500">{icon}</span>}
        {title}
      </h2>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="text-orange-600 hover:text-orange-700 text-sm font-semibold flex items-center gap-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md px-1"
        >
          Xem tất cả <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
