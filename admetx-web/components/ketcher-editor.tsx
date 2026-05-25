'use client';

import { useEffect, useRef } from 'react';
import type { Ketcher } from 'ketcher-core';

export type { Ketcher };

interface Props {
  onInit?: (ketcher: Ketcher) => void;
}

/**
 * KetcherEditor — mounts the ketcher-react Editor with the bundled
 * StandaloneStructServiceProvider (WASM-based, no server needed).
 * This component must only be rendered on the client (no SSR).
 */
export function KetcherEditor({ onInit }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;
    (async () => {
      // Dynamic imports so Next.js doesn't try to SSR these browser-only packages.
      // ketcher-standalone's package.json exports map lacks a "types" field for subpaths,
      // so we suppress the TS resolution warning with @ts-ignore.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore – ketcher-standalone package.json exports don't declare types for this subpath
      const ketcherStandalone = await import('ketcher-standalone/dist/binaryWasm');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { Editor } = await (import('ketcher-react') as Promise<any>);

      // Import CSS after packages are resolved (avoids SSR CSS issues).
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await import('ketcher-react/dist/index.css');

      if (!mounted || !containerRef.current) return;

      // Create a React root inside our container and render the editor.
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(containerRef.current);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { StandaloneStructServiceProvider } = ketcherStandalone as any;
      const structServiceProvider = new StandaloneStructServiceProvider();

      root.render(
        <Editor
          staticResourcesUrl=""
          structServiceProvider={structServiceProvider}
          onInit={onInit}
          disableMacromoleculesEditor
        />
      );
    })();

    return () => { mounted = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
