'use client';
/**
 * /ketcher — full-page Ketcher molecule editor.
 * Loaded inside an <iframe> by KetcherCanvas on the predict page.
 * No authentication required; the parent page already owns the session.
 */

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { Ketcher } from 'ketcher-core';

// Load editor only on the client (heavy WASM + browser APIs).
const KetcherEditor = dynamic(
  () => import('@/components/ketcher-editor').then((m) => ({ default: m.KetcherEditor })),
  { ssr: false, loading: () => <div style={loadingStyle}>加载分子编辑器…</div> }
);

const loadingStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  fontFamily: 'sans-serif',
  color: '#94a3b8',
  fontSize: 13,
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255,255,255,0.75)',
  fontFamily: 'sans-serif',
  color: '#94a3b8',
  fontSize: 13,
  zIndex: 9999,
  pointerEvents: 'none',
};

export default function KetcherPage() {
  // wasmReady gates interaction: Ketcher's undo() calls ketcherProvider.getKetcher()
  // which returns null until the WASM service finishes loading, causing a silent
  // TypeError. onInit is only called after WASM is ready, so we block interaction
  // (via pointer-events:none overlay) until then.
  const [wasmReady, setWasmReady] = useState(false);

  const onInit = useCallback((ketcher: Ketcher) => {
    (window as unknown as { ketcher: Ketcher }).ketcher = ketcher;
    setWasmReady(true);
  }, []);

  useEffect(() => {
    const blank = new Image();
    blank.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const suppress = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer?.setDragImage(blank, 0, 0);
    };
    document.addEventListener('dragstart', suppress, true);
    return () => document.removeEventListener('dragstart', suppress, true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Override Ketcher's molecule-shaped SVG cursor with a plain crosshair */}
      <style>{`
        [class*="intermediateCanvas"][class*="enableCursor"],
        [class*="intermediateCanvas"][class*="enableCursor"]:active {
          cursor: crosshair !important;
        }
      `}</style>
      <KetcherEditor onInit={onInit} />
      {!wasmReady && (
        <div style={overlayStyle}>
          正在初始化编辑器…
        </div>
      )}
    </div>
  );
}
