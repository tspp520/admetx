import Link from 'next/link';
import { ModelCard as M } from '@/lib/model-catalog';

export function ModelCard({ m }: { m: M }) {
  const hasData = m.status === 'dataset';
  return (
    <Link href={`/models/${m.slug}`}
      className="block bg-white border border-slate-200 rounded-md p-3.5 hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start gap-2 mb-1">
        <h3 className="text-sm text-slate-800 leading-snug">{m.name}</h3>
        <span className="shrink-0 text-[11px] text-slate-500 border border-slate-200 rounded px-1.5 py-0.5">
          {m.type === 'classification' ? '分类' : '回归'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>{m.category}</span>
        <span className="text-slate-300">·</span>
        <span className="inline-flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-teal-500' : 'bg-slate-300'}`} />
          {hasData ? '数据就绪' : '占位'}
        </span>
      </div>
      {m.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{m.description}</p>}
    </Link>
  );
}
