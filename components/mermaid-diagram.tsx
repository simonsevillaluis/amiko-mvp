"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidDiagramProps {
  code: string;
}

export function MermaidDiagram({ code }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            primaryColor: "#EDF4FF",
            primaryTextColor: "#09367C",
            primaryBorderColor: "#C3D9FF",
            lineColor: "#5B8DEF",
            secondaryColor: "#F0FFF4",
            tertiaryColor: "#fff",
            fontSize: "14px",
          },
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, code.trim());
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [code, id]);

  if (error) {
    return (
      <div className="my-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold text-amiko-muted">
        No pude mostrar el diagrama.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="my-3 overflow-x-auto rounded-2xl border border-blue-100 bg-white p-3 shadow-sm [&_svg]:max-w-full"
    />
  );
}
