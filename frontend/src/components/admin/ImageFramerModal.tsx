"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, ZoomIn, ZoomOut, Move, RotateCcw, Check, SkipForward, Layers } from "lucide-react";

/** Relación de aspecto final de las imágenes (coincide con la galería pública). */
const ASPECT = 4 / 3;
const OUTPUT_W = 1920;
const OUTPUT_H = Math.round(OUTPUT_W / ASPECT);
const PREVIEW_W = 720;
const PREVIEW_H = Math.round(PREVIEW_W / ASPECT);

type Background = "blur" | "white" | "navy";
type Settings = { scale: number; offX: number; offY: number; bg: Background };

const DEFAULT_SETTINGS: Settings = { scale: 0.9, offX: 0, offY: 0, bg: "blur" };

const BG_OPTIONS: { value: Background; label: string; swatch: string }[] = [
  { value: "blur", label: "Desenfocado", swatch: "linear-gradient(135deg,#94a3b8,#cbd5e1,#64748b)" },
  { value: "white", label: "Blanco", swatch: "#ffffff" },
  { value: "navy", label: "Azul AAA", swatch: "#0b2545" },
];

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/** Dibuja la imagen dentro del marco con margen/zoom/desplazamiento y fondo. */
function drawFramed(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number, s: Settings) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  ctx.clearRect(0, 0, W, H);

  if (s.bg === "blur") {
    // Desenfoque compatible con Safari: reducir a miniatura y ampliar con suavizado.
    const tiny = document.createElement("canvas");
    tiny.width = 24;
    tiny.height = Math.max(1, Math.round(24 / ASPECT));
    const tctx = tiny.getContext("2d")!;
    const cover = Math.max(tiny.width / iw, tiny.height / ih);
    tctx.drawImage(img, (tiny.width - iw * cover) / 2, (tiny.height - ih * cover) / 2, iw * cover, ih * cover);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(tiny, 0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = s.bg === "white" ? "#ffffff" : "#0b2545";
    ctx.fillRect(0, 0, W, H);
  }

  const contain = Math.min(W / iw, H / ih);
  const k = contain * s.scale;
  const dw = iw * k;
  const dh = ih * k;
  const x = (W - dw) / 2 + s.offX * W;
  const y = (H - dh) / 2 + s.offY * H;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = s.scale < 1 ? W * 0.02 : 0;
  ctx.drawImage(img, x, y, dw, dh);
  ctx.restore();
}

async function exportFramed(file: File, img: HTMLImageElement, s: Settings): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_W;
  canvas.height = OUTPUT_H;
  drawFramed(canvas.getContext("2d")!, img, OUTPUT_W, OUTPUT_H, s);

  const toBlob = (type: string, q: number) =>
    new Promise<Blob | null>((res) => canvas.toBlob(res, type, q));

  // Safari no codifica WEBP: si el navegador devuelve otro formato, usar JPEG.
  let blob = await toBlob("image/webp", 0.9);
  let ext = "webp";
  if (!blob || blob.type !== "image/webp") {
    blob = await toBlob("image/jpeg", 0.9);
    ext = "jpg";
  }
  const base = file.name.replace(/\.[^.]+$/, "") || "imagen";
  return new File([blob!], `${base}.${ext}`, { type: blob!.type, lastModified: Date.now() });
}

interface Props {
  files: File[];
  onComplete: (processed: File[]) => void;
  onCancel: () => void;
}

export default function ImageFramerModal({ files, onComplete, onCancel }: Props) {
  const [index, setIndex] = useState(0);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const results = useRef<File[]>([]);
  const drag = useRef<{ x: number; y: number; offX: number; offY: number } | null>(null);

  const file = files[index];

  useEffect(() => {
    let cancelled = false;
    setImg(null);
    loadImage(file).then((loaded) => {
      if (!cancelled) setImg(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    drawFramed(canvasRef.current.getContext("2d")!, img, PREVIEW_W, PREVIEW_H, settings);
  }, [img, settings]);

  const advance = useCallback(
    (processed: File) => {
      results.current.push(processed);
      if (index + 1 < files.length) {
        setIndex(index + 1);
        setSettings((s) => ({ ...s, offX: 0, offY: 0 }));
      } else {
        onComplete(results.current);
      }
    },
    [index, files.length, onComplete]
  );

  const applyCurrent = async () => {
    if (!img) return;
    setBusy(true);
    try {
      advance(await exportFramed(file, img, settings));
    } finally {
      setBusy(false);
    }
  };

  const applyToAll = async () => {
    if (!img) return;
    setBusy(true);
    try {
      results.current.push(await exportFramed(file, img, settings));
      for (let i = index + 1; i < files.length; i++) {
        const other = await loadImage(files[i]);
        results.current.push(await exportFramed(files[i], other, { ...settings, offX: 0, offY: 0 }));
      }
      onComplete(results.current);
    } finally {
      setBusy(false);
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, offX: settings.offX, offY: settings.offY };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - drag.current.x) / rect.width;
    const dy = (e.clientY - drag.current.y) / rect.height;
    setSettings((s) => ({ ...s, offX: drag.current!.offX + dx, offY: drag.current!.offY + dy }));
  };
  const onPointerUp = () => {
    drag.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    setSettings((s) => ({ ...s, scale: Math.min(3, Math.max(0.4, s.scale - e.deltaY * 0.001)) }));
  };

  const marginPct = Math.max(0, Math.round((1 - settings.scale) * 100));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Ajustar imagen antes de subir</h2>
            <p className="text-xs text-slate-500">
              Imagen {index + 1} de {files.length} · <span className="font-medium">{file.name}</span>
            </p>
          </div>
          <button id="framer-close" onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 text-slate-500" title="Cancelar">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_260px] gap-6 p-6">
          {/* Preview */}
          <div>
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              <canvas
                id="framer-canvas"
                ref={canvasRef}
                width={PREVIEW_W}
                height={PREVIEW_H}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onWheel={onWheel}
                className="block w-full h-auto cursor-grab active:cursor-grabbing touch-none"
              />
              {!img && <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">Cargando…</div>}
            </div>
            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              <Move className="w-3.5 h-3.5" /> Arrastra para mover · rueda del mouse para acercar/alejar. Así se verá en la galería.
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="framer-zoom" className="text-sm font-semibold text-slate-800">Margen / Zoom</label>
                <span className="text-xs font-medium text-blue-600">
                  {settings.scale < 1 ? `Margen ${marginPct}%` : settings.scale === 1 ? "Ajuste exacto" : `Zoom ${Math.round(settings.scale * 100)}%`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut className="w-4 h-4 text-slate-400" />
                <input
                  id="framer-zoom"
                  type="range"
                  min={0.4}
                  max={3}
                  step={0.01}
                  value={settings.scale}
                  onChange={(e) => setSettings((s) => ({ ...s, scale: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-600"
                />
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: "Con margen", v: 0.85 },
                  { label: "Completa", v: 1 },
                  { label: "Llenar", v: img ? Math.max(ASPECT / (img.naturalWidth / img.naturalHeight), (img.naturalWidth / img.naturalHeight) / ASPECT) : 1.3 },
                ].map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setSettings((s) => ({ ...s, scale: p.v, offX: 0, offY: 0 }))}
                    className="px-2 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-700 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-800 mb-2">Fondo del margen</p>
              <div className="grid grid-cols-3 gap-2">
                {BG_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setSettings((s) => ({ ...s, bg: o.value }))}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-[11px] font-medium transition-all ${
                      settings.bg === o.value ? "border-blue-500 ring-2 ring-blue-100 text-blue-700" : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="w-8 h-8 rounded-md border border-slate-200" style={{ background: o.swatch }} />
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSettings(DEFAULT_SETTINGS)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restablecer
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
          <button
            id="framer-skip"
            onClick={() => advance(file)}
            disabled={busy}
            className="inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 disabled:opacity-50"
          >
            <SkipForward className="w-4 h-4" /> Subir original sin ajustar
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            {files.length - index > 1 && (
              <button
                id="framer-apply-all"
                onClick={applyToAll}
                disabled={busy || !img}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-50"
              >
                <Layers className="w-4 h-4" /> Aplicar a las {files.length - index} restantes
              </button>
            )}
            <button
              id="framer-apply"
              onClick={applyCurrent}
              disabled={busy || !img}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {busy ? "Procesando…" : index + 1 < files.length ? "Aplicar y siguiente" : "Aplicar y subir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
