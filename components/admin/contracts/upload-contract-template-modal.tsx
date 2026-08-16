// components/admin/contracts/upload-contract-template-modal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { createContractTemplateAction } from "@/lib/actions/contracts/contract-template";
import { Button } from "@/components/ui/button";
import {
  FileCode2,
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadContractTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadContractTemplateModal({
  open,
  onOpenChange,
}: UploadContractTemplateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [s3Key, setS3Key] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [mode, setMode] = useState<"body" | "file">("body");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setBody("");
      setS3Key("");
      setIsActive(true);
      setMode("body");
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await createContractTemplateAction({
        name,
        description,
        body: mode === "body" ? body : undefined,
        s3Key: mode === "file" ? s3Key : undefined,
        isActive,
      });

      if (!res.success) {
        setError(res.error || "Something went wrong");
      } else {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onOpenChange(false);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Contract Template</DialogTitle>
          <DialogDescription>
            Upload a template file or write HTML/Text content for the contract.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Contract template created successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Template Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Template Source</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode("body")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                  mode === "body"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <FileCode2 className="h-4 w-4" /> Text / HTML
              </button>

              <button
                type="button"
                onClick={() => setMode("file")}
                className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                  mode === "file"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground"
                }`}
              >
                <UploadCloud className="h-4 w-4" /> Static S3 PDF
              </button>
            </div>
          </div>

          {mode === "body" && (
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full font-mono rounded-md border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}

          {mode === "file" && (
            <input
              type="text"
              value={s3Key}
              onChange={(e) => setS3Key(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || success}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {success ? "Saved!" : "Save Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

