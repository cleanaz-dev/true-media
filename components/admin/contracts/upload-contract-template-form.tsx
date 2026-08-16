"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileCode2, UploadCloud, Loader2, CheckCircle2, AlertCircle, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createContractTemplateAction,
  uploadContractTemplateFileAction,
} from "@/lib/actions/contracts/contract-template";

export function UploadContractTemplateForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [mode, setMode] = useState<"body" | "file">("body");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setName("");
    setDescription("");
    setBody("");
    setFile(null);
    setIsActive(true);
    setMode("body");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "file" && !file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      let s3Key: string | undefined;
      let extractedText: string | undefined;

      if (mode === "file" && file) {
        const uploadRes = await uploadContractTemplateFileAction(file);
        if (!uploadRes.success || !uploadRes.s3Key) {
          setError(uploadRes.error || "Failed to upload file");
          setIsSubmitting(false);
          return;
        }
        s3Key = uploadRes.s3Key;
        extractedText = uploadRes.extractedText; 
      }

      const res = await createContractTemplateAction({
        name,
        description,
        body: mode === "body" ? body : extractedText,
        s3Key,
        isActive,
      });

      if (!res.success) {
        setError(res.error || "Something went wrong");
      } else {
        setSuccess(true);
        resetForm();
        setTimeout(() => {
          setSuccess(false);
          router.refresh();
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>Contract template created successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Template Name <span className="text-destructive">*</span>
          </Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Template Source</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("body")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition",
              mode === "body" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
            )}
          >
            <FileCode2 className="h-4 w-4" /> Text / HTML
          </button>

          <button
            type="button"
            onClick={() => setMode("file")}
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition",
              mode === "file" ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"
            )}
          >
            <UploadCloud className="h-4 w-4" /> Upload PDF
          </button>
        </div>
      </div>

      {mode === "body" && (
        <div className="space-y-1.5">
          <Label htmlFor="body">Content</Label>
          <Textarea
            id="body"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste HTML or plain text content for the contract..."
            className="font-mono"
          />
        </div>
      )}

      {mode === "file" && (
        <div className="space-y-1.5">
          <Label htmlFor="file">PDF File</Label>
          {!file ? (
            <label
              htmlFor="file"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-sm text-muted-foreground hover:border-primary hover:text-primary"
            >
              <UploadCloud className="h-6 w-6" />
              <span>Click to select a PDF, or drag one here</span>
              <input
                ref={fileInputRef}
                id="file"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <div className="flex items-center justify-between rounded-lg border p-3 text-sm">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
        />
        <Label htmlFor="isActive" className="font-normal">
          Set as active template
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting || success}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {success ? "Saved!" : "Save Template"}
        </Button>
      </div>
    </form>
  );
}