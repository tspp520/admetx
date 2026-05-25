'use client';
import { useState } from 'react';

export function FileDropzone({ onSmiles }: { onSmiles: (s: string[]) => void }) {
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function upload(f: File) {
    setErr(null); setBusy(true);
    const fd = new FormData(); fd.append('file', f);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.message || '解析失败');
      return;
    }
    const { smiles } = await res.json();
    onSmiles(smiles);
  }
  return (
    <div
      className="border-2 border-dashed border-slate-200 rounded-md py-12 text-center
                 text-slate-500 text-sm bg-slate-50/50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}
    >
      {busy ? '解析中…' : (
        <>
          拖动文件到此处或
          <label className="text-teal-600 cursor-pointer ml-1">
            点击上传
            <input type="file" className="hidden"
                   accept=".txt,.smi,.csv"
                   onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
          </label>
          <div className="mt-2 text-xs text-slate-400">支持 TXT、SMI、CSV</div>
        </>
      )}
      {err && <p className="mt-3 text-red-500 text-xs">{err}</p>}
    </div>
  );
}
