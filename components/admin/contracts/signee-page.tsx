"use client";

import { useState, useRef } from "react";
import { SigneeWithContract } from "@/lib/actions/contracts/get-signee";
import { submitSignature } from "@/lib/actions/contracts/submit-signature";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Download, ExternalLink, FileCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SigneePageProps {
  signee: SigneeWithContract;
  pdfUrl: string | null;
}

export function SigneePage({ signee, pdfUrl }: SigneePageProps) {
  const isAlreadySigned = signee.status === "SIGNED";
  const [signature, setSignature] = useState(signee.name || "");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSignedSuccessfully, setHasSignedSuccessfully] = useState(isAlreadySigned);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast.error("Please agree to the legal terms before signing");
      return;
    }
    if (!signature.trim()) {
      toast.error("Please enter your signature");
      return;
    }

    try {
      setIsSubmitting(true);
      await submitSignature({
        signToken: signee.signToken!,
        signatureTxt: signature,
      });

      setHasSignedSuccessfully(true);
      toast.success("Contract signed successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold">{signee.contract.title}</h1>
            <p className="text-xs text-muted-foreground">Signer: {signee.name} ({signee.email})</p>
          </div>
        </div>

        {pdfUrl && (
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open PDF
            </a>
          </div>
        )}
      </header>

      {/* Main Signing Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PDF Viewer */}
        <div className="lg:col-span-8 h-[780px] bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="Contract Preview"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Document preview is currently unavailable.
            </div>
          )}
        </div>

        {/* Action / Signing Card */}
        <div className="lg:col-span-4 space-y-6">
          {hasSignedSuccessfully ? (
            <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader className="text-center pb-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <CardTitle className="text-emerald-900 dark:text-emerald-100">
                  Document Signed
                </CardTitle>
                <CardDescription>
                  Thank you! You have successfully reviewed and signed this document.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-xs text-muted-foreground pt-2">
                Signed on: {signee.signedAt ? new Date(signee.signedAt).toLocaleString() : new Date().toLocaleString()}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Sign Document</CardTitle>
                <CardDescription>
                  Review the document on the left and enter your signature below.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signature">Signature (Type Full Legal Name)</Label>
                    <Input
                      id="signature"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="font-serif italic text-lg tracking-wide bg-muted/40"
                      required
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Typing your name acts as your binding electronic signature.
                    </p>
                  </div>

                  <div className="flex items-start space-x-3 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreed}
                      onCheckedChange={(val) => setAgreed(!!val)}
                    />
                    <Label
                      htmlFor="terms"
                      className="text-xs text-muted-foreground font-normal leading-snug cursor-pointer"
                    >
                      I agree to be legally bound by this document and acknowledge my electronic signature is valid.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!agreed || !signature.trim() || isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Complete &amp; Sign
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}