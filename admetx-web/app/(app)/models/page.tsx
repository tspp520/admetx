import { MODELS } from '@/lib/model-catalog';
import { ModelCard } from '@/components/model-card';

export default function ModelsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">模型库</h1>
      <p className="text-sm text-slate-500 mb-6">首版为占位模型卡片，实际预测由后端 predictor 统一调度。</p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MODELS.map((m) => <ModelCard key={m.slug} m={m} />)}
      </div>
    </div>
  );
}
