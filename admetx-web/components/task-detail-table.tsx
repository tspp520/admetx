'use client';
import { useEffect, useState } from 'react';

type Item = {
  id: number; idx: number; smiles: string; parsedOk: boolean;
  result: Record<string, Record<string, number|boolean>> | null;
  errorMessage: string | null;
};
type Task = {
  id: string; name: string; project: string; status: string;
  totalCount: number; finishedCount: number; errorMessage: string | null;
};

const terminal = new Set(['succeeded','partial_failed','failed']);

export function TaskDetailTable({ id }: { id: string }) {
  const [task, setTask] = useState<Task | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    async function tick() {
      const r = await fetch(`/api/tasks/${id}`);
      if (!cancelled && r.ok) {
        const j = await r.json();
        setTask(j.task); setItems(j.items);
        if (!terminal.has(j.task.status)) timer = setTimeout(tick, 2000);
      }
    }
    tick();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [id]);
  if (!task) return <div className="text-slate-500">加载中…</div>;
  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <header className="bg-white rounded-lg border p-5">
        <h2 className="text-lg font-semibold">{task.name}</h2>
        <p className="text-sm text-slate-500">项目: {task.project}</p>
        <p className="text-sm mt-1">状态: <b>{task.status}</b> &nbsp; 进度 {task.finishedCount}/{task.totalCount}</p>
        {task.errorMessage && <p className="text-red-500 text-sm mt-1">错误: {task.errorMessage}</p>}
      </header>
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 bg-slate-50 border-b">
            <tr><th className="text-left px-3 py-2">#</th>
                <th className="text-left px-3 py-2">SMILES</th>
                <th className="text-left px-3 py-2">解析</th>
                <th className="text-left px-3 py-2">指标 (摘要)</th></tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b last:border-0">
                <td className="px-3 py-2 text-slate-400">{it.idx}</td>
                <td className="px-3 py-2 font-mono break-all">{it.smiles}</td>
                <td className="px-3 py-2">{it.parsedOk ? '✓' : <span className="text-red-500">✗ {it.errorMessage}</span>}</td>
                <td className="px-3 py-2 text-xs">
                  {it.result && (
                    <pre className="whitespace-pre-wrap text-slate-600 max-h-48 overflow-auto">
                      {JSON.stringify(it.result, null, 2)}
                    </pre>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
