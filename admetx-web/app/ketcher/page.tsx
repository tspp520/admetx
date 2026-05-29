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
    // Eliminate the browser's native HTML5 drag ghost image.
    // Ketcher moves atoms via mousemove; the ghost is purely a browser artefact.
    // e.preventDefault() alone is insufficient in some Chrome builds when a
    // draggable element (Ketcher's scrollbar has draggable=true) is involved —
    // setDragImage with a blank 1×1 GIF ensures the ghost is fully suppressed.
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
