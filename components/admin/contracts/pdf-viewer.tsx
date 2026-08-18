// components/admin/contracts/pdf-viewer.tsx
"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";

interface PdfViewerProps {
  url: string;
}

// No react-pdf, no pdf.js, no canvas, no worker. Every modern browser
// (desktop and mobile) has a native PDF renderer built in — this just
// hands the URL to that. It's less "custom" than the old paginated/zoom
// UI, but it's the version that doesn't crash.
export function PdfViewer({ url }: PdfViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
        <AlertCircle className="w-8 h-8 text-destructive" />
        <div>
          <p className="text-sm font-semibold">Unable to preview document</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the &ldquo;Open Original&rdquo; button above to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-muted/20">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground pointer-events-none">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs">Loading document...</p>
        </div>
      )}
      <object
        data={`${url}#toolbar=1&view=FitH`}
        type="application/pdf"
        className="w-full h-full relative z-10"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      >
        {/* Renders only if the browser truly can't display <object> as a PDF */}
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-6">
          <p className="text-sm font-semibold">Preview not supported on this browser</p>
          <p className="text-xs text-muted-foreground">
            Use the &ldquo;Open Original&rdquo; button above to view it.
          </p>
        </div>
      </object>
    </div>
  );
}