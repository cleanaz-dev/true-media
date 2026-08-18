"use client";

import React, {
  forwardRef,
  useRef,
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from "react";
import { RotateCcw, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SignaturePadRef {
  toDataURL: (type?: string, quality?: number) => string;
  isEmpty: () => boolean;
  clear: () => void;
  undo: () => void;
}

interface SignaturePadProps {
  onChange?: (isEmpty: boolean) => void;
  className?: string;
  height?: number;
}

type Point = { x: number; y: number };

export const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ onChange, className, height = 130 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [isEmpty, setIsEmpty] = useState(true);
    const [strokeCount, setStrokeCount] = useState(0);

    const isDrawing = useRef(false);
    const pointsRef = useRef<Point[]>([]);
    const strokesRef = useRef<Point[][]>([]);

    // ─── Setup high-DPI canvas ───
    const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 2.2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      redrawStrokes(ctx, rect.width, strokesRef.current);
    }, [height]);

    const redrawStrokes = useCallback(
      (
        ctx: CanvasRenderingContext2D,
        width: number,
        strokes: Point[][] = strokesRef.current
      ) => {
        ctx.clearRect(0, 0, width, height);
        strokes.forEach((stroke) => drawSmoothStroke(ctx, stroke));
      },
      [height]
    );

    const drawSmoothStroke = (
      ctx: CanvasRenderingContext2D,
      points: Point[]
    ) => {
      if (points.length < 2) {
        if (points.length === 1) {
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      for (let i = 1; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
      }

      const last = points[points.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.stroke();
    };

    // ─── Resize observer ───
    useEffect(() => {
      setupCanvas();
      const observer = new ResizeObserver(() => setupCanvas());
      if (containerRef.current) observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, [setupCanvas]);

    // ─── Coordinate helpers ───
    const getCoords = (
      e: React.MouseEvent | React.TouchEvent
    ): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();

      if ("touches" in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    // ─── Drawing handlers ───
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      if ("touches" in e) e.preventDefault();

      isDrawing.current = true;
      const coords = getCoords(e);
      if (!coords) return;

      pointsRef.current = [coords];

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.arc(coords.x, coords.y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing.current) return;
      if ("touches" in e) e.preventDefault();

      const coords = getCoords(e);
      if (!coords) return;

      pointsRef.current.push(coords);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const points = pointsRef.current;
      if (points.length >= 3) {
        const i = points.length - 2;
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
        ctx.stroke();
      }
    };

    const stopDrawing = () => {
      if (!isDrawing.current) return;
      isDrawing.current = false;

      const points = pointsRef.current;
      if (points.length < 2) {
        pointsRef.current = [];
        return;
      }

      strokesRef.current.push([...points]);
      setStrokeCount((c) => c + 1);
      setIsEmpty(false);
      onChange?.(false);
      pointsRef.current = [];

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      redrawStrokes(ctx, rect.width);
    };

    // ─── Exposed methods ───
    const clear = useCallback(() => {
      strokesRef.current = [];
      pointsRef.current = [];
      setStrokeCount(0);
      setIsEmpty(true);
      onChange?.(true);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, height);
    }, [height, onChange]);

    const undo = useCallback(() => {
      if (strokesRef.current.length === 0) return;

      strokesRef.current.pop();
      const newCount = strokesRef.current.length;
      setStrokeCount(newCount);
      const nowEmpty = newCount === 0;
      setIsEmpty(nowEmpty);
      onChange?.(nowEmpty);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      redrawStrokes(ctx, rect.width);
    }, [height, onChange, redrawStrokes]);

    const toDataURL = useCallback(
      (type = "image/png", quality?: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return "";
        return canvas.toDataURL(type, quality);
      },
      []
    );

    useImperativeHandle(ref, () => ({
      toDataURL,
      isEmpty: () => isEmpty,
      clear,
      undo,
    }));

    return (
      <div className={cn("space-y-1.5", className)}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Draw Signature *</span>
          <div className="flex items-center gap-2">
            {strokeCount > 0 && (
              <button
                type="button"
                onClick={undo}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                <Undo2 className="w-3 h-3" /> Undo
              </button>
            )}
            {!isEmpty && (
              <button
                type="button"
                onClick={clear}
                className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 overflow-hidden touch-none select-none"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full cursor-crosshair block"
            style={{ touchAction: "none", height }}
          />
          {isEmpty && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground/40 font-medium tracking-wide">
                Sign here with mouse or finger
              </span>
            </div>
          )}

          {/* Subtle grid background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        {strokeCount > 0 && strokeCount < 3 && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400">
            Try to make your signature more complete for better verification.
          </p>
        )}
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";