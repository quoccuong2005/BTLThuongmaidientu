import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react';
import { ContentController } from '@/controllers/ContentController';

const formatDate = (value?: string) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const getCover = (value?: string) =>
  value || `https://placehold.co/1200x720?text=${encodeURIComponent('Content')}`;



export default async function ContentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const content = await ContentController.getContentBySlug(params.slug);
  if (!content) return notFound();



  return (
    <div className="max-w-5xl mx-auto px-3 md:px-4 py-6 space-y-6">
      <Link
        href="/content"
        className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
      >
        <ArrowLeft size={16} /> Back to content
      </Link>

      <section className="tech-shell relative overflow-hidden rounded-3xl p-6 text-white">
        <img
          src={getCover(content.coverImageUrl)}
          alt={content.title}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/40 to-transparent" />
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-100">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1">
              <Sparkles size={12} /> Featured read
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> {formatDate(content.publishedAt)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">
            {content.title}
          </h1>
          {content.summary && (
            <p className="max-w-2xl text-sm text-orange-100/90">
              {content.summary}
            </p>
          )}
        </div>
      </section>

      <article className="tech-card rounded-3xl border border-orange-100 bg-white p-6 text-slate-700">
        {content.content ? (
          <div
            className="prose prose-orange max-w-none text-sm leading-relaxed
      prose-headings:text-slate-900
      prose-p:text-slate-700
      prose-a:text-orange-600
      prose-img:rounded-2xl
      prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        ) : content.summary ? (
          <p className="text-sm leading-relaxed text-slate-700">
            {content.summary}
          </p>
        ) : (
          <p className="text-sm text-slate-500">No content available.</p>
        )}
      </article>
    </div>
  );
}
