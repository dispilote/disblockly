"use client";

import { useEffect, useRef } from "react";

interface BlocklyBootstrapProps {
  readonly width?: string;
  readonly height?: string;
  readonly fullScreen?: boolean;
}

export default function BlocklyBootstrap({
  width = "100%",
  height = "600px",
  fullScreen = false,
}: BlocklyBootstrapProps) {
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<unknown | null>(null);

  useEffect(() => {
    let workspace: unknown = null;

    const initBlockly = async () => {
      if (!blocklyDivRef.current) return;

      try {
        // Dynamically import Blockly and block definitions
        const Blockly = await import("blockly");
        
        // Import block definitions - this is critical!
        await import("blockly/blocks");
        
        // Import JavaScript code generator (optional, for code generation)
        await import("blockly/javascript");

        // Inject Blockly workspace with toolbox
        workspace = Blockly.inject(blocklyDivRef.current, {
          toolbox: {
            kind: "flyoutToolbox",
            contents: [
              {
                kind: "block",
                type: "controls_if",
              },
              {
                kind: "block",
                type: "controls_whileUntil",
              },
            ],
          },
        });

        workspaceRef.current = workspace;
        console.log("Blockly workspace injected successfully");
      } catch (error) {
        console.error("Error initializing Blockly:", error);
      }
    };

    initBlockly();

    return () => {
      // Cleanup workspace on unmount
      if (workspaceRef.current && typeof (workspaceRef.current as any).dispose === "function") {
        (workspaceRef.current as any).dispose();
        workspaceRef.current = null;
      }
    };
  }, []);

  const containerStyle = fullScreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
      }
    : {
        width,
        height,
      };

  return <div ref={blocklyDivRef} style={containerStyle} />;
}
