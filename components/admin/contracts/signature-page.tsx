// app/(public)/onboarding/[tokenId]/_components/signature-pad.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw, PenTool, Type } from "lucide-react";

interface SignaturePadProps {
  initialName: string;
  onSignatureChange: (dataUrl: string | null) => void;
}

export function SignaturePad({ initialName, onSignatureChange }: SignaturePadProps) {
  const [tab, setTab] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState(initialName);
  const [selectedFont, setSelectedFont] = useState("font-serif italic");

  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const hasDrawn = useRef(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [tab]);

  // Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    isDrawing.current = true;
    hasDrawn.current = true;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (canvasRef.current && hasDrawn.current) {
      onSignatureChange(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onSignatureChange(null);
  };

  // Convert typed name to canvas PNG data URL
  const handleTypedChange = (name: string) => {
    setTypedName(name);
    if (!name.trim()) {
      onSignatureChange(null);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.font = "italic 36px Georgia, serif";
      ctx.fillStyle = "#0f172a";
      ctx.fillText(name, 20, 60);
      onSignatureChange(canvas.toDataURL("image/png"));
    }
  };

  return (
    <div className="space-y-3">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "draw" | "type")}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="draw" className="gap-1.5 text-xs">
            <PenTool className="w-3.5 h-3.5" /> Draw Signature
          </TabsTrigger>
          <TabsTrigger value="type" className="gap-1.5 text-xs">
            <Type className="w-3.5 h-3.5" /> Type Name
          </TabsTrigger>
        </TabsList>

        {/* DRAW TAB */}
        <TabsContent value="draw" className="space-y-2 pt-2">
          <div className="relative border-2 border-dashed rounded-lg bg-white overflow-hidden">
            <canvas
              ref={canvasRef}
              width={350}
              height={140}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-[140px] cursor-crosshair touch-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearCanvas}
              className="absolute top-2 right-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Clear
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center">
            Sign inside the box using your mouse or finger
          </p>
        </TabsContent>

        {/* TYPE TAB */}
        <TabsContent value="type" className="space-y-3 pt-2">
          <Input
            value={typedName}
            onChange={(e) => handleTypedChange(e.target.value)}
            placeholder="Type your legal name"
            className="text-base"
          />
          <div className="p-4 border rounded-lg bg-muted/20 text-center">
            <span className="font-serif italic text-2xl tracking-wide text-foreground">
              {typedName || "Signature Preview"}
            </span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}