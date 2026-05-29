'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

const MIN_H = 300;
const MAX_H = 900;
const DEFAULT_H = 480;

export function KetcherCanvas({ onSmiles }: { onSmiles: (s: string) => void }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(DEFAULT_H);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const startH = useRef(0);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e?.data?.type === 'admetx:ketcher:smiles' && typeof e.data.smiles === 'string') {
        onSmiles(e.data.smiles);
      }
    }
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [onSmiles]);

  const stopDrag = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const delta = e.clientY - startY.current;
    setHeight(Math.min(MAX_H, Math.max(MIN_H, startH.current + delta)));
  }, []);

  const onMouseUp = useCallback(() => {
    stopDrag();
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }, [stopDrag, onMouseMove]);

  function onHandleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    startY.current = e.clientY;
    startH.current = height;
    setIsDragging(true);
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

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
      <div className="relative w-full" style={{ height }}>
        <iframe ref={ref} src="/ketcher"
                className="w-full h-full block" title="ketcher" />
        {/* transparent overlay blocks iframe from swallowing mouse events during drag */}
        {isDragging && (
          <div className="absolute inset-0 z-10" style={{ cursor: 'row-resize' }} />
        )}
      </div>
      {/* drag handle */}
      <div
        onMouseDown={onHandleMouseDown}
        className={`h-4 cursor-row-resize flex items-center justify-center gap-1 select-none transition-colors ${
          isDragging ? 'bg-teal-100' : 'bg-slate-100 hover:bg-teal-100'
        }`}
        title="拖拽调整高度"
      >
        {[0,1,2,3,4].map(i => (
          <span key={i} className={`w-1 h-1 rounded-full transition-colors ${isDragging ? 'bg-teal-400' : 'bg-slate-400'}`} />
        ))}
      </div>
      <div className="border-t bg-slate-50 px-3 py-2 flex justify-end">
        <button onClick={pullSmiles}
          className="bg-teal-500 hover:bg-teal-600 text-white text-xs rounded px-3 py-1">
          导出 SMILES
        </button>
      </div>
    </div>
  );
}
