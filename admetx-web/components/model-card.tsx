import Link from 'next/link';
import { ModelCard as M } from '@/lib/model-catalog';

export function ModelCard({ m }: { m: M }) {
  return (
    <Link href={`/models/${m.slug}`}
      className="block bg-white border rounded-lg p-5 hover:border-teal-400 hover:shadow-sm transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-slate-800">{m.name}</h3>
        <span className="text-[10px] uppercase tracking-wider text-teal-600 border border-teal-200 rounded px-2 py-0.5">
          {m.type === 'classification' ? '分类' : '回归'}
        </span>
      </div>
      <p className="text-xs text-slate-500">{m.category} · 占位</p>
      <p className="text-sm text-slate-600 mt-3 line-clamp-2">{m.description}</p>
    </Link>
  );
}
