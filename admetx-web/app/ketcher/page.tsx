'use client';
/**
 * /ketcher — full-page Ketcher molecule editor.
 * Loaded inside an <iframe> by KetcherCanvas on the predict page.
 * No authentication required; the parent page already owns the session.
 */

import { useEffect } from 'react';
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

function onInit(ketcher: Ketcher) {
  (window as unknown as { ketcher: Ketcher }).ketcher = ketcher;
}

export default function KetcherPage() {
  useEffect(() => {
    // Prevent the browser from producing a native HTML5 drag ghost image when
    // the user clicks and moves atoms/molecules. Ketcher handles movement via
    // mousemove; the ghost is purely a browser artefact we don't want.
    const suppress = (e: DragEvent) => e.preventDefault();
    document.addEventListener('dragstart', suppress, true);
    return () => document.removeEventListener('dragstart', suppress, true);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Override Ketcher's molecule-shaped SVG cursor with a plain crosshair */}
      <style>{`
        [class*="intermediateCanvas"][class*="enableCursor"],
        [class*="intermediateCanvas"][class*="enableCursor"]:active {
          cursor: crosshair !important;
        }
      `}</style>
      <KetcherEditor onInit={onInit} />
    </div>
  );
}
