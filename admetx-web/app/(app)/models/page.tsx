'use client';
import { useMemo, useState } from 'react';
import { MODELS } from '@/lib/model-catalog';
import { ModelCard } from '@/components/model-card';

const CATS = ['理化', '代谢', '毒性', '转运体', '风险评估'] as const;
type Filter = 'all' | 'dataset' | 'classification' | 'regression';

export default function ModelsPage() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [open, setOpen] = useState<Record<string, boolean>>({ __ready__: true });

  const list = useMemo(
    () =>
      MODELS.filter((m) => {
        if (q && !m.name.toLowerCase().includes(q.toLowerCase())) return false;
        if (filter === 'dataset') return m.status === 'dataset';
        if (filter === 'classification') return m.type === 'classification';
        if (filter === 'regression') return m.type === 'regression';
        return true;
      }),
    [q, filter]
  );

  const ready = list.filter((m) => m.status === 'dataset');
  const nData = MODELS.filter((m) => m.status === 'dataset').length;
  const byCat = (c: string) => list.filter((m) => m.category === c);
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const chip = (f: Filter, label: string) => (
    <button
      onClick={() => setFilter(f)}
      className={`text-xs px-2.5 py-1 border-b-2 transition-colors ${
        filter === f
          ? 'border-teal-600 text-slate-800'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-1">模型库</h1>
      <p className="text-sm text-slate-500 mb-4">
        共 {MODELS.length} 项 · 有数据 {nData} · 占位 {MODELS.length - nData}。首版占位卡片，实际预测由后端 predictor 统一调度。
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {chip('all', '全部')}
        {chip('dataset', '有数据')}
        {chip('classification', '分类')}
        {chip('regression', '回归')}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索属性…"
          className="ml-auto text-sm border border-slate-200 rounded-md px-3 py-1.5 w-48 focus:outline-none focus:border-teal-400"
        />
      </div>

      {ready.length > 0 && (
        <Section
          title={`有公开数据集 · 首批可训练 (${ready.length})`}
          k="__ready__"
          open={open.__ready__}
          onToggle={toggle}
          items={ready}
        />
      )}

      {CATS.map((c) => {
        const items = byCat(c);
        if (!items.length) return null;
        return (
          <Section
            key={c}
            title={`${c}参数 (${items.length})`}
            k={c}
            open={!!open[c]}
            onToggle={toggle}
            items={items}
          />
        );
      })}

      {list.length === 0 && (
        <p className="text-sm text-slate-400 py-10 text-center">无匹配属性</p>
      )}
    </div>
  );
}

function Section({
  title,
  k,
  open,
  onToggle,
  items,
}: {
  title: string;
  k: string;
  open: boolean;
  onToggle: (k: string) => void;
  items: typeof MODELS;
}) {
  return (
    <section className="mb-2 border-b border-slate-200">
      <button
        onClick={() => onToggle(k)}
        className="w-full flex items-center gap-2 py-3 text-left group"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? 'rotate-90' : ''}`}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
        <span className="text-sm text-slate-700 group-hover:text-slate-900">{title}</span>
      </button>
      {open && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 pb-4">
          {items.map((m) => (
            <ModelCard key={m.slug + m.category} m={m} />
          ))}
        </div>
      )}
    </section>
  );
}
