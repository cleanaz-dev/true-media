"use client";

import { FileText, ExternalLink, Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContractPdfViewerProps {
  pdfUrl: string | null;
  title?: string;
}

export function ContractPdfViewer({ pdfUrl, title }: ContractPdfViewerProps) {
  if (!pdfUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
        <FileText className="w-12 h-12 mb-3 text-muted-foreground/50 animate-pulse" />
        <p className="font-medium text-foreground">PDF is still generating or not available</p>
        <p className="text-sm">Please check back in a few moments.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* Viewer toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40 text-xs text-muted-foreground">
        <span>{title ? `${title}.pdf` : "Document Preview"}</span>
        <div className="flex items-center gap-2">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "h-8 gap-1.5")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open in Tab
          </a>

          <a
            href={pdfUrl}
            download
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 gap-1.5")}
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>

      {/* Embedded Iframe */}
      <iframe
        src={`${pdfUrl}#toolbar=0`}
        title="Contract PDF Viewer"
        className="w-full h-full border-0 bg-neutral-900/5"
      />
    </div>
  );
}