'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type T = {
  id: string; name: string; project: string; status: string;
  totalCount: number; finishedCount: number; createdAt: string;
};

const labels: Record<string,string> = {
  queued:'排队中', running:'进行中', succeeded:'成功',
  partial_failed:'部分失败', failed:'失败',
};

export function TaskTable() {
  const [rows, setRows] = useState<T[]>([]);
  useEffect(() => {
    let cancelled = false;
    async function tick() {
      const r = await fetch('/api/tasks');
      if (!cancelled && r.ok) setRows((await r.json()).tasks);
    }
    tick();
    const h = setInterval(tick, 3000);
    return () => { cancelled = true; clearInterval(h); };
  }, []);
  return (
    <div className="bg-white rounded-lg border max-w-6xl mx-auto">
      <table className="w-full text-sm">
        <thead className="text-slate-500 bg-slate-50 border-b">
          <tr>
            <th className="text-left px-4 py-3">任务名称</th>
            <th className="text-left px-4 py-3">项目</th>
            <th className="text-left px-4 py-3">进度</th>
            <th className="text-left px-4 py-3">状态</th>
            <th className="text-left px-4 py-3">创建时间</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-slate-50">
              <td className="px-4 py-3">{t.name}</td>
              <td className="px-4 py-3 text-slate-500">{t.project}</td>
              <td className="px-4 py-3">{t.finishedCount}/{t.totalCount}</td>
              <td className="px-4 py-3">{labels[t.status] ?? t.status}</td>
              <td className="px-4 py-3 text-slate-500">{new Date(t.createdAt).toLocaleString('zh-CN')}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/tasks/${t.id}`} className="text-teal-600 hover:underline">查看</Link>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={6} className="text-center py-10 text-slate-400">暂无任务</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
