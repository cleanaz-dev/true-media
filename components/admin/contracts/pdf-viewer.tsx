// components/admin/contracts/pdf-viewer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ChevronLeft, ChevronRight, AlertCircle, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set worker safely
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(320);
  const [loadError, setLoadError] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure container width safely
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth - 32);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setLoadError(false);
  }

  function goToPrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }

  return (
    <div className="flex flex-col h-full w-full bg-muted/20">
      {/* Viewer Controls Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-background border-b text-xs sticky top-0 z-10">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <span className="px-2 font-medium">
            Page {pageNumber} of {numPages || "--"}
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setScale((s) => Math.max(s - 0.15, 0.7))}
            disabled={scale <= 0.7}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] text-muted-foreground w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setScale((s) => Math.min(s + 0.15, 1.6))}
            disabled={scale >= 1.6}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* PDF Canvas Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 flex items-start justify-center"
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={() => setLoadError(true)}
          loading={
            <div className="flex flex-col items-center justify-center p-12 gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">Loading document...</p>
            </div>
          }
          error={
            <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <div>
                <p className="text-sm font-semibold">Unable to load preview</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You can still review the document using the &ldquo;Open Original&rdquo; button above.
                </p>
              </div>
            </div>
          }
        >
          {!loadError && (
            <div className="bg-card shadow-md rounded-md overflow-hidden border">
              <Page
                pageNumber={pageNumber}
                width={containerWidth ? containerWidth * scale : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="h-80 w-full flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                }
              />
            </div>
          )}
        </Document>
      </div>
    </div>
  );
}