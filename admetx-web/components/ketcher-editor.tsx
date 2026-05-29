'use client';

import { useEffect, useState } from 'react';
import type { Ketcher } from 'ketcher-core';

export type { Ketcher };

interface Props {
  onInit?: (ketcher: Ketcher) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditorType = React.ComponentType<any>;

/**
 * KetcherEditor — renders ketcher-react Editor inside the same React root so
 * that React's event delegation and Ketcher's internal Redux store (undo/redo
 * history) work correctly.
 *
 * Previous approach used createRoot() which created a second isolated React
 * root; events dispatched there were invisible to Ketcher's history reducer,
 * permanently disabling the Undo button.
 */
export function KetcherEditor({ onInit }: Props) {
  const [Editor, setEditor] = useState<EditorType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [serviceProvider, setServiceProvider] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // @ts-ignore – ketcher-standalone subpath has no types declaration
      const standalone = await import('ketcher-standalone/dist/binaryWasm');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { Editor: E } = await (import('ketcher-react') as Promise<any>);
      // @ts-ignore
      await import('ketcher-react/dist/index.css');
      if (cancelled) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { StandaloneStructServiceProvider } = standalone as any;
      setServiceProvider(new StandaloneStructServiceProvider());
      setEditor(() => E);
    })();
    return () => { cancelled = true; };
  }, []);

  if (!Editor || !serviceProvider) return null;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Editor
        staticResourcesUrl=""
        structServiceProvider={serviceProvider}
        onInit={onInit}
        disableMacromoleculesEditor
      />
    </div>
  );
}
