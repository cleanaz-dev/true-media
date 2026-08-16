// components/admin/contracts/upload-contract-template-modal.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useAdminLayout } from "@/context/layout-context";
import { createContractTemplateAction } from "@/lib/actions/contracts/contract-template";
import { Button } from "@/components/ui/button";
import {
  X,
  FileCode2,
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function UploadContractTemplateModal() {
  const { activeModal, closeModal } = useAdminLayout();
  const [isPending, startTransition] = useTransition();

  const isOpen = activeModal === "UPLOAD_CONTRACT_TEMPLATE";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [s3Key, setS3Key] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [mode, setMode] = useState<"body" | "file">("body");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // CRASH FIX: Only use `isOpen` in the dependency array!
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Lock scroll

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset"; // Unlock scroll
    };
  }, [isOpen]); // <-- This prevents infinite loops!

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
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
          setName("");
          setDescription("");
          setBody("");
          setS3Key("");
          closeModal();
        }, 1000);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background text-foreground animate-in fade-in-0 duration-200">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Create Contract Template</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={closeModal}
          disabled={isPending}
          className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <form id="contract-template-form" onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-6">
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
              <label className="mb-1.5 block text-sm font-medium">Template Name <span className="text-destructive">*</span></label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Template Source</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setMode("body")} className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${mode === "body" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>
                <FileCode2 className="h-4 w-4" /> Text / HTML
              </button>

              <button type="button" onClick={() => setMode("file")} className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${mode === "file" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>
                <UploadCloud className="h-4 w-4" /> Static S3 PDF
              </button>
            </div>
          </div>

          {mode === "body" && (
             <textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} className="w-full font-mono rounded-md border bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          )}

          {mode === "file" && (
             <input type="text" value={s3Key} onChange={(e) => setS3Key(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          )}
        </form>
      </div>

      <footer className="flex h-16 shrink-0 items-center justify-end gap-3 border-t bg-muted/30 px-4 sm:px-8">
        <Button type="button" variant="outline" onClick={closeModal} disabled={isPending}>Cancel</Button>
        <Button type="submit" form="contract-template-form" disabled={isPending || success}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {success ? "Saved!" : "Save Template"}
        </Button>
      </footer>
    </div>
  );
}