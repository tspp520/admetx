'use client';
/**
 * /ketcher — full-page Ketcher molecule editor.
 * Loaded inside an <iframe> by KetcherCanvas on the predict page.
 * No authentication required; the parent page already owns the session.
 */

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
  // Expose ketcher on the iframe window so the parent can call getSmiles().
  (window as unknown as { ketcher: Ketcher }).ketcher = ketcher;
}

export default function KetcherPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <KetcherEditor onInit={onInit} />
    </div>
  );
}
