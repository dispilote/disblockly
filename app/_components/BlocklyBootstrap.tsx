"use client";
import { useEffect, useRef } from 'react';
import type { WorkspaceSvg } from 'blockly/core';

type Props = Readonly<{
  width?: number | string;
  height?: number | string;
  fullScreen?: boolean;
}>;

export default function BlocklyBootstrap({ width = 600, height = 480, fullScreen = false }: Props) {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Dynamically import Blockly so the module is only loaded on the client
    (async () => {
      const mod = await import('blockly/core');
      const Blockly = mod as unknown as {
        setLocale?: (m: unknown) => void;
        inject: (el: HTMLElement, opts: unknown) => WorkspaceSvg;
        Themes: { Classic: unknown };
      };

      const En = await import('blockly/msg/en');

      if (!isMounted) return;

      // set locale if available
      Blockly.setLocale?.(En);

      if (blocklyDivRef.current) {
        // If a previous workspace exists, dispose it first
        if (workspaceRef.current) {
          try {
            workspaceRef.current.dispose();
          } catch (disposeErr) {
            console.warn('Blockly dispose error', disposeErr);
          }
          workspaceRef.current = null;
        }

        const workspace = Blockly.inject(blocklyDivRef.current, {
          toolbox: {
            kind: 'flyoutToolbox',
            contents: [
              {
                kind: 'block',
                type: 'controls_if',
              },
              {
                kind: 'block',
                type: 'controls_whileUntil'
              }
            ]
          },
          scrollbars: true,
          trashcan: true,
          zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
          },
          grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
          },
          renderer: 'thrasos',
          theme: Blockly.Themes.Classic
        });

        workspaceRef.current = workspace;
        console.log('Blockly workspace injected', workspace);
      }
    })();

    return () => {
      isMounted = false;
      if (workspaceRef.current) {
        try {
          workspaceRef.current.dispose();
        } catch (disposeErr) {
          console.warn('Blockly dispose error', disposeErr);
        }
        workspaceRef.current = null;
      }
    };
  }, []);

  const style: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999
      }
    : { width, height };

  return <div ref={blocklyDivRef} id="blocklyDiv" style={style} />;
}