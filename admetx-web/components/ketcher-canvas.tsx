'use client';
import { useEffect, useRef } from 'react';

export function KetcherCanvas({ onSmiles }: { onSmiles: (s: string) => void }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e?.data?.type === 'admetx:ketcher:smiles' && typeof e.data.smiles === 'string') {
        onSmiles(e.data.smiles);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onSmiles]);

  async function pullSmiles() {
    const win = ref.current?.contentWindow as unknown as { ketcher?: { getSmiles?: () => Promise<string> } };
    if (!win?.ketcher?.getSmiles) {
      onSmiles('');
      return;
    }
    const smi = await win.ketcher.getSmiles();
    onSmiles(smi);
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <iframe ref={ref} src="/ketcher"
              className="w-full h-[480px]" title="ketcher" />
      <div className="border-t bg-slate-50 px-3 py-2 flex justify-end">
        <button onClick={pullSmiles}
          className="bg-teal-500 hover:bg-teal-600 text-white text-xs rounded px-3 py-1">
          导出 SMILES
        </button>
      </div>
    </div>
  );
}
