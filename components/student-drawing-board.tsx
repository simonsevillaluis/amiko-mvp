"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AmikoIcon } from "@/components/amiko-icon";

type DrawingPoint = {
  x: number;
  y: number;
};

type StrokeAction = {
  kind: "stroke";
  color: string;
  size: number;
  erase: boolean;
  points: DrawingPoint[];
};

type FillAction = {
  kind: "fill";
  x: number;
  y: number;
  color: string;
};

type DrawingAction = StrokeAction | FillAction;

type Tool = "draw" | "erase" | "fill";

const PAPER_COLOR = "#FFFFFF";

const COLORS = [
  { label: "Azul", value: "#1357C8" },
  { label: "Verde", value: "#86C72C" },
  { label: "Amarillo", value: "#F7C948" },
  { label: "Coral", value: "#F06F61" },
  { label: "Negro", value: "#17202E" },
];

const SIZES = [
  { label: "Fino", value: 4 },
  { label: "Medio", value: 9 },
  { label: "Grande", value: 16 },
];

function readStoredActions(storageKey: string): DrawingAction[] {
  if (typeof window === "undefined") return [];

  try {
    const raw =
      window.localStorage.getItem(`${storageKey}:actions`) ??
      window.localStorage.getItem(`${storageKey}:strokes`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Migra datos antiguos guardados antes de soportar fill/balde de pintura.
    return parsed.map((item) =>
      item && item.kind ? item : { kind: "stroke", ...item },
    );
  } catch {
    return [];
  }
}

function hexToRgba(hex: string): [number, number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return [r, g, b, 255];
}

// Relleno por inundación clásico (como el balde de pintura de Paint): solo
// cambia el área de píxeles conectada al punto de inicio, respetando los
// contornos ya dibujados. Usa tolerancia para absorber el antialiasing del
// canvas en los bordes de las líneas.
function floodFillImageData(
  imageData: ImageData,
  startXPixel: number,
  startYPixel: number,
  fillColor: [number, number, number, number],
) {
  const { data, width, height } = imageData;
  const startX = Math.min(width - 1, Math.max(0, Math.floor(startXPixel)));
  const startY = Math.min(height - 1, Math.max(0, Math.floor(startYPixel)));

  const startIndex = (startY * width + startX) * 4;
  const startColor: [number, number, number, number] = [
    data[startIndex],
    data[startIndex + 1],
    data[startIndex + 2],
    data[startIndex + 3],
  ];

  if (
    startColor[0] === fillColor[0] &&
    startColor[1] === fillColor[1] &&
    startColor[2] === fillColor[2] &&
    startColor[3] === fillColor[3]
  ) {
    return;
  }

  const tolerance = 40;
  const matchesStart = (dataIndex: number) =>
    Math.abs(data[dataIndex] - startColor[0]) <= tolerance &&
    Math.abs(data[dataIndex + 1] - startColor[1]) <= tolerance &&
    Math.abs(data[dataIndex + 2] - startColor[2]) <= tolerance &&
    Math.abs(data[dataIndex + 3] - startColor[3]) <= tolerance;

  const visited = new Uint8Array(width * height);
  const stack: number[] = [startX, startY];

  while (stack.length > 0) {
    const y = stack.pop()!;
    const x = stack.pop()!;
    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const pixelIndex = y * width + x;
    if (visited[pixelIndex]) continue;

    const dataIndex = pixelIndex * 4;
    if (!matchesStart(dataIndex)) continue;

    visited[pixelIndex] = 1;
    data[dataIndex] = fillColor[0];
    data[dataIndex + 1] = fillColor[1];
    data[dataIndex + 2] = fillColor[2];
    data[dataIndex + 3] = fillColor[3];

    stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
  }
}

export function StudentDrawingBoard({
  storageKey = "amiko:student:drawing",
}: {
  storageKey?: string;
}) {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const currentStrokeRef = useRef<StrokeAction | null>(null);
  const [actions, setActions] = useState<DrawingAction[]>(() => readStoredActions(storageKey));
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState(SIZES[1].value);
  const [tool, setTool] = useState<Tool>("draw");
  const [savedMessage, setSavedMessage] = useState("Listo para dibujar");

  const renderCanvas = useCallback((items: DrawingAction[]) => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = Math.max(280, rect.width);
    const height = Math.max(330, Math.min(410, width * 1.22));

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    context.fillStyle = PAPER_COLOR;
    context.fillRect(0, 0, width, height);
    context.lineCap = "round";
    context.lineJoin = "round";

    items.forEach((action) => {
      if (action.kind === "fill") {
        // getImageData/putImageData operan en píxeles físicos del buffer,
        // sin pasar por el transform lógico — hay que escalar por dpr.
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        floodFillImageData(
          imageData,
          action.x * width * dpr,
          action.y * height * dpr,
          hexToRgba(action.color),
        );
        context.putImageData(imageData, 0, 0);
        return;
      }

      if (action.points.length === 0) return;

      context.strokeStyle = action.erase ? PAPER_COLOR : action.color;
      context.lineWidth = action.erase ? action.size * 1.7 : action.size;
      context.beginPath();

      const [firstPoint, ...nextPoints] = action.points;
      context.moveTo(firstPoint.x * width, firstPoint.y * height);

      if (nextPoints.length === 0) {
        context.lineTo(firstPoint.x * width + 0.1, firstPoint.y * height + 0.1);
      } else {
        nextPoints.forEach((point) => {
          context.lineTo(point.x * width, point.y * height);
        });
      }

      context.stroke();
    });
  }, []);

  useEffect(() => {
    renderCanvas(actions);
  }, [renderCanvas, actions]);

  useEffect(() => {
    const observer = new ResizeObserver(() => renderCanvas(actions));
    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [renderCanvas, actions]);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>): DrawingPoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  };

  const startStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getPoint(event);

    if (tool === "fill") {
      setActions((items) => [...items, { kind: "fill", x: point.x, y: point.y, color }]);
      setSavedMessage("Área pintada");
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    currentStrokeRef.current = {
      kind: "stroke",
      color,
      size,
      erase: tool === "erase",
      points: [point],
    };
    setSavedMessage(tool === "erase" ? "Borrando" : "Dibujando");
  };

  const continueStroke = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const currentStroke = currentStrokeRef.current;
    if (!currentStroke) return;

    currentStroke.points.push(getPoint(event));
    renderCanvas([...actions, currentStroke]);
  };

  const finishStroke = () => {
    const currentStroke = currentStrokeRef.current;
    if (!currentStroke) return;

    currentStrokeRef.current = null;
    setActions((items) => [...items, currentStroke]);
    setSavedMessage("Puedes seguir");
  };

  const undo = () => {
    setActions((items) => items.slice(0, -1));
    setSavedMessage("Deshecho");
  };

  const clear = () => {
    setActions([]);
    setSavedMessage("Hoja limpia");
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    window.localStorage.setItem(`${storageKey}:actions`, JSON.stringify(actions));
    window.localStorage.removeItem(`${storageKey}:strokes`);
    window.localStorage.removeItem(`${storageKey}:sheetColor`);
    window.localStorage.setItem(`${storageKey}:image`, canvas.toDataURL("image/png"));
    window.localStorage.setItem(`${storageKey}:savedAt`, new Date().toISOString());
    setSavedMessage("Dibujo guardado");
  };

  return (
    <div className="space-y-4">
      <section className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-amiko-navy shadow-sm"
          aria-label="Volver"
        >
          <AmikoIcon name="back" className="h-6 w-6" />
        </button>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amiko-green">
            Recurso
          </p>
          <h1 className="text-3xl font-black text-amiko-navy">Dibujar</h1>
          <p className="mt-1 text-sm font-bold text-amiko-muted">Expresa una idea</p>
        </div>
      </section>

      <section className="rounded-[28px] border-2 border-amiko-green/30 bg-white/80 p-3 shadow-sm">
        <div
          ref={wrapperRef}
          className="overflow-hidden rounded-[22px] border-2 border-sky-100 bg-white shadow-inner"
        >
          <canvas
            ref={canvasRef}
            className="block w-full touch-none cursor-crosshair"
            aria-label="Lienzo para dibujar"
            onPointerDown={startStroke}
            onPointerMove={continueStroke}
            onPointerUp={finishStroke}
            onPointerCancel={finishStroke}
            onPointerLeave={finishStroke}
          />
        </div>
      </section>

      <section className="rounded-[24px] bg-white p-4 shadow-sm">
        <div className="mb-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-amiko-muted">
            Color
          </p>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setColor(item.value);
                  setTool((current) => (current === "erase" ? "draw" : current));
                  setSavedMessage(item.label);
                }}
                className={`focus-ring h-12 rounded-2xl border-4 transition active:scale-95 ${
                  tool !== "erase" && color === item.value ? "border-amiko-navy" : "border-white"
                }`}
                style={{ backgroundColor: item.value }}
                aria-label={`Usar color ${item.label}`}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-amiko-muted">
            Grosor
          </p>
          <div className="grid grid-cols-3 gap-2">
            {SIZES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => {
                  setSize(item.value);
                  setSavedMessage(item.label);
                }}
                className={`focus-ring flex h-12 items-center justify-center rounded-2xl border-2 bg-slate-50 transition active:scale-95 ${
                  size === item.value ? "border-amiko-green text-amiko-navy" : "border-slate-100 text-slate-400"
                }`}
                aria-label={`Usar grosor ${item.label}`}
              >
                <span className="rounded-full bg-current" style={{ width: item.value * 1.35, height: item.value * 1.35 }} />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setTool((current) => (current === "fill" ? "draw" : "fill"));
              setSavedMessage(tool === "fill" ? "Color activo" : "Toca el lienzo donde quieras pintar");
            }}
            aria-pressed={tool === "fill"}
            className={`focus-ring flex min-h-14 items-center justify-center gap-2 rounded-2xl px-3 text-xs font-black transition active:scale-95 ${
              tool === "fill"
                ? "bg-amiko-mint text-amiko-navy shadow-[0_3px_0_#B5D989]"
                : "bg-slate-50 text-amiko-ink"
            }`}
          >
            <AmikoIcon name="paint-bucket" className="h-5 w-5" />
            Balde de pintura
          </button>
          <button
            type="button"
            onClick={() => {
              setTool((current) => (current === "erase" ? "draw" : "erase"));
              setSavedMessage(tool === "erase" ? "Color activo" : "Borrador activo");
            }}
            aria-pressed={tool === "erase"}
            className={`focus-ring min-h-14 rounded-2xl px-2 text-xs font-black transition active:scale-95 ${
              tool === "erase"
                ? "bg-amiko-blue text-white shadow-[0_3px_0_#0F3876]"
                : "bg-slate-50 text-amiko-ink"
            }`}
          >
            Borrar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={undo}
            disabled={actions.length === 0}
            className="focus-ring min-h-14 rounded-2xl bg-slate-50 px-2 text-xs font-black text-amiko-ink transition active:scale-95 disabled:text-slate-300"
          >
            Deshacer
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={actions.length === 0}
            className="focus-ring min-h-14 rounded-2xl bg-slate-50 px-2 text-xs font-black text-amiko-ink transition active:scale-95 disabled:text-slate-300"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={save}
            className="focus-ring min-h-14 rounded-2xl bg-amiko-green px-2 text-xs font-black text-white shadow-[0_3px_0_#5D8B20] transition active:translate-y-[3px] active:shadow-none"
          >
            Guardar
          </button>
        </div>

        <p className="mt-3 text-center text-xs font-black text-amiko-muted" aria-live="polite">
          {savedMessage}
        </p>
      </section>
    </div>
  );
}
