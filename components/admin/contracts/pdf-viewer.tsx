// components/admin/contracts/pdf-viewer.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, AlertCircle } from "lucide-react";

// Required react-pdf styles for text selection & annotations
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
}

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamically measure container width for responsive scaling on mobile & desktop
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        // Subtract horizontal padding so the page doesn't clip
        setContainerWidth(containerRef.current.clientWidth - 24);
      }
    };

    updateWidth();
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto bg-muted/40 p-3 sm:p-4 flex flex-col items-center gap-4 select-none"
    >
      {numPages && (
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border shadow-xs px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
          {numPages} {numPages === 1 ? "Page" : "Pages"}
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs">Loading document pages...</p>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-destructive p-4 text-center">
            <AlertCircle className="w-6 h-6" />
            <p className="text-xs font-medium">Failed to load PDF preview.</p>
          </div>
        }
        className="flex flex-col items-center gap-4 w-full"
      >
        {numPages &&
          Array.from(new Array(numPages), (_, index) => (
            <div
              key={`page_${index + 1}`}
              className="bg-card shadow-md rounded-md overflow-hidden border border-border"
            >
              <Page
                pageNumber={index + 1}
                width={containerWidth ? Math.min(containerWidth, 800) : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="h-96 w-full flex items-center justify-center bg-card">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  </div>
                }
              />
              <div className="text-[10px] text-center py-1 text-muted-foreground bg-muted/30 border-t">
                Page {index + 1} of {numPages}
              </div>
            </div>
          ))}
      </Document>
    </div>
  );
}