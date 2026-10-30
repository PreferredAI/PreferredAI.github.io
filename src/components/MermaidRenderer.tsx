"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: Record<string, unknown>) => void;
      render: (
        id: string,
        text: string,
      ) => Promise<{ svg: string; bindFunctions?: (el: Element) => void }>;
    };
  }
}

export function MermaidRenderer() {
  useEffect(() => {
    const mermaidBlocks = Array.from(
      document.querySelectorAll<HTMLElement>("pre > code.language-mermaid"),
    );
    if (mermaidBlocks.length === 0) return;

    let isMounted = true;

    function loadMermaidScript(): Promise<NonNullable<typeof window.mermaid>> {
      if (window.mermaid) return Promise.resolve(window.mermaid);

      return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(
          'script[src*="mermaid"]',
        ) as HTMLScriptElement | null;

        if (existingScript) {
          existingScript.addEventListener("load", () => {
            if (window.mermaid) resolve(window.mermaid);
            else reject(new Error("Mermaid failed to initialize"));
          });
          existingScript.addEventListener("error", reject);
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
        script.async = true;
        script.onload = () => {
          if (window.mermaid) resolve(window.mermaid);
          else reject(new Error("Mermaid failed to initialize"));
        };
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    async function renderAllDiagrams() {
      try {
        const mermaid = await loadMermaidScript();
        if (!isMounted) return;

        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "loose",
          fontFamily: "inherit",
          themeVariables: {
            fontFamily: "inherit",
            primaryColor: "#eff6ff",
            primaryTextColor: "#1e3a8a",
            primaryBorderColor: "#93c5fd",
            lineColor: "#64748b",
            secondaryColor: "#f8fafc",
            tertiaryColor: "#f1f5f9",
          },
        });

        for (let i = 0; i < mermaidBlocks.length; i++) {
          const codeEl = mermaidBlocks[i];
          const preEl = codeEl.parentElement;
          if (!preEl || preEl.getAttribute("data-mermaid-rendered")) continue;

          const rawCode = codeEl.textContent?.trim() || "";
          if (!rawCode) continue;

          const id = `mermaid-diagram-${Date.now()}-${i}`;

          try {
            const { svg } = await mermaid.render(id, rawCode);
            if (!isMounted) return;

            const container = document.createElement("div");
            container.className =
              "my-6 flex justify-center overflow-x-auto rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-sm";
            container.innerHTML = svg;

            preEl.setAttribute("data-mermaid-rendered", "true");
            preEl.parentNode?.replaceChild(container, preEl);
          } catch (renderError) {
            console.error("Failed to render Mermaid diagram:", renderError);
          }
        }
      } catch (err) {
        console.error("Failed to load Mermaid library:", err);
      }
    }

    renderAllDiagrams();

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
