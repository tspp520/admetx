'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SmilesTextarea } from './smiles-textarea';
import { FileDropzone } from './file-dropzone';
import { KetcherCanvas } from './ketcher-canvas';

type Tab = 'smiles' | 'draw' | 'upload';

export function PredictForm() {
  const [tab, setTab] = useState<Tab>('smiles');
  const [smilesText, setSmilesText] = useState('');
  const [project, setProject] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState<string|null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit() {
    setErr(null);
    const lines = smilesText.split(/\r?\n/).map((l)=>l.trim()).filter(Boolean);
    if (lines.length === 0) return setErr('请填入 SMILES');
    if (!name || !project) return setErr('请填写项目名称与任务名称');
    setBusy(true);
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, project, smiles: lines }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(()=>({}));
      return setErr(j.message || '提交失败');
    }
    const { task } = await res.json();
    router.push(`/tasks/${task.id}`);
  }

  return (
    <div className="bg-white rounded-lg border p-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">分子输入</h2>
      <div className="flex gap-1 border-b mb-4">
        {(['smiles','draw','upload'] as Tab[]).map((t) => (
          <button key={t} onClick={()=>setTab(t)}
            className={`px-4 py-2 text-sm border-b-2 -mb-px ${
              tab===t ? 'border-teal-500 text-teal-600 font-medium' : 'border-transparent text-slate-500'
            }`}>
            {t==='smiles'?'输入SMILES':t==='draw'?'绘制分子':'上传文件'}
          </button>
        ))}
      </div>

      {tab==='smiles' && <SmilesTextarea value={smilesText} onChange={setSmilesText} />}
      {tab==='draw'   && (
        <KetcherCanvas onSmiles={(s) => {
          if (s) setSmilesText((prev) => prev ? prev + '\n' + s : s);
          setTab('smiles');
        }} />
      )}
      {tab==='upload' && <FileDropzone onSmiles={(s)=>{ setSmilesText(s.join('\n')); setTab('smiles'); }} />}

      <h2 className="text-lg font-semibold mt-8 mb-3">提交信息</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs text-slate-500 mb-1"><span className="text-red-500">*</span>项目名称</label>
          <input className="border rounded-md w-full px-3 py-2 text-sm"
                 value={project} onChange={(e)=>setProject(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1"><span className="text-red-500">*</span>任务名称</label>
          <input className="border rounded-md w-full px-3 py-2 text-sm"
                 value={name} onChange={(e)=>setName(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={submit} disabled={busy}
          className="bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white text-sm
                     font-medium rounded-md px-5 py-2">
          {busy ? '提交中…' : '提交任务'}
        </button>
      </div>
      {err && <p className="text-right text-sm text-red-500 mt-3">{err}</p>}
    </div>
  );
}
