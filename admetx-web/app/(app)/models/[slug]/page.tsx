import { MODELS } from '@/lib/model-catalog';
import { notFound } from 'next/navigation';

export default async function ModelDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = MODELS.find((x) => x.slug === slug);
  if (!m) notFound();
  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-lg p-6 space-y-3">
      <h1 className="text-xl font-semibold">{m.name}</h1>
      <p className="text-sm text-slate-500">{m.category} · {m.type === 'classification' ? '分类' : '回归'} · 占位</p>
      <p className="text-slate-700">{m.description}</p>
      <p className="text-xs text-slate-400 mt-6">真模型接入待完成。提交预测请回到「预测」页。</p>
    </div>
  );
}
