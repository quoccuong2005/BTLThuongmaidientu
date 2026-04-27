import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  viewAllHref?: string;
  icon?: string;
}

export function SectionHeader({ title, viewAllHref, icon }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
        {icon && <span className="text-xl">{icon}</span>}
        {title}
      </h2>
      {viewAllHref && (
        <Link href={viewAllHref} className="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-0.5">
          Xem tất cả <ChevronRight size={14} />
        </Link>
      )}
    </div>
  );
}
