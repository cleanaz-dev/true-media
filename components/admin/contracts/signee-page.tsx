"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SigneeWithContract } from "@/lib/actions/contracts/get-signee";
import { submitSignature } from "@/lib/actions/contracts/submit-signature";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle2,
  ExternalLink,
  FileCheck,
  Loader2,
  ShieldCheck,
  PenTool,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { SignaturePad, SignaturePadRef } from "@/components/admin/contracts/signature-pad";

interface SigneePageProps {
  signee: SigneeWithContract;
  pdfUrl: string | null;
}

export function SigneePage({ signee, pdfUrl }: SigneePageProps) {
  const router = useRouter();
  const isAlreadySigned = signee.status === "SIGNED";

  const [printedName, setPrintedName] = useState(signee.name || "");
  const [hasReviewedDoc, setHasReviewedDoc] = useState(false);
  const [agreedToEsign, setAgreedToEsign] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSignedSuccessfully, setHasSignedSuccessfully] = useState(isAlreadySigned);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  const [isMobile, setIsMobile] = useState(false);
  const [hasOpenedPdf, setHasOpenedPdf] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasScrolledToBottom(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  const reviewRequirementMet = !pdfUrl || (isMobile ? hasOpenedPdf : hasScrolledToBottom);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reviewRequirementMet) {
      toast.error(
        isMobile
          ? "Please open and review the PDF before signing."
          : "Please scroll down and review the entire document before signing."
      );
      return;
    }

    if (!hasReviewedDoc || !agreedToEsign) {
      toast.error("Please complete all acknowledgement checkboxes.");
      return;
    }
    if (!printedName.trim()) {
      toast.error("Please enter your printed legal name.");
      return;
    }
    if (signatureEmpty || !signaturePadRef.current) {
      toast.error("Please draw your signature in the signature box.");
      return;
    }

    const signatureImage = signaturePadRef.current.toDataURL("image/png");

    try {
      setIsSubmitting(true);
      await submitSignature({
        signToken: signee.signToken!,
        printedName: printedName.trim(),
        signatureTxt: signatureImage,
        title: signee.role || "",
      });

      setIsSubmitting(false);
      setIsFinalizing(true);

      await new Promise((res) => setTimeout(res, 3500));

      setHasSignedSuccessfully(true);
      setIsFinalizing(false);
      toast.success("Contract signed successfully!");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to sign contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    printedName.trim().length > 0 &&
    !signatureEmpty &&
    hasReviewedDoc &&
    agreedToEsign &&
    !isSubmitting &&
    reviewRequirementMet;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="bg-background border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3 truncate">
          <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h1 className="text-sm sm:text-base font-semibold truncate">{signee.contract.title}</h1>
            <p className="text-xs text-muted-foreground truncate">Signer: {signee.email}</p>
          </div>
        </div>

        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 shrink-0 text-xs sm:text-sm")}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open PDF in New Tab</span>
            <span className="sm:hidden">Open PDF</span>
          </a>
        )}
      </header>

      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="hidden lg:flex lg:col-span-7 h-[850px] bg-card rounded-xl border shadow-xs overflow-hidden flex-col">
          {pdfUrl ? (
            <iframe
              src={`${pdfUrl}#toolbar=0`}
              title="Contract Document Preview"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Document preview is currently unavailable.
            </div>
          )}
          <div ref={sentinelRef} className="h-4" />
        </div>

        <div className="w-full lg:col-span-5 space-y-4">
          
          {pdfUrl && !hasSignedSuccessfully && !isFinalizing && (
            <Card className="lg:hidden border-primary/20 bg-primary/5 shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
                  <FileCheck className="w-4 h-4" />
                  Review Contract PDF
                </CardTitle>
                <CardDescription className="text-xs">
                  Tap below to open and scroll through all pages in your phone&apos;s native viewer.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex gap-2">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setHasOpenedPdf(true)}
                  className={cn(buttonVariants({ variant: "default", size: "sm" }), "flex-1 gap-2 text-xs font-medium")}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Open Document
                </a>
                <a
                  href={pdfUrl}
                  download
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs")}
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </a>
              </CardContent>
            </Card>
          )}

          {hasSignedSuccessfully || isFinalizing ? (
            <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs">
              <CardHeader className="text-center pb-3">
                {isFinalizing ? (
                  <>
                    <Loader2 className="w-12 h-12 text-primary mx-auto mb-2 animate-spin" />
                    <CardTitle className="text-primary">Finalizing Contract...</CardTitle>
                    <CardDescription>
                      Sealing your signed copy. This will only take a moment.
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                    <CardTitle className="text-emerald-900 dark:text-emerald-100">
                      Document Signed &amp; Recorded
                    </CardTitle>
                    <CardDescription>
                      Thank you! Your signature has been legally recorded.
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              {!isFinalizing && (
                <CardContent className="text-center text-xs text-muted-foreground space-y-1 pt-2">
                  <p>
                    <strong>Signed by:</strong> {printedName || signee.name}
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {signee.signedAt ? new Date(signee.signedAt).toLocaleString() : new Date().toLocaleString()}
                  </p>
                </CardContent>
              )}
            </Card>
          ) : (
            <Card className="shadow-xs">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PenTool className="w-5 h-5 text-primary" />
                  Sign Document
                </CardTitle>
                <CardDescription>
                  Enter your legal printed name, draw your signature, and submit.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!reviewRequirementMet && (
                    <div className="rounded-md bg-amber-50 border border-amber-200 p-3 flex items-start gap-2 text-xs text-amber-800">
                      <Eye className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>
                        {isMobile
                          ? "Please open and review the contract PDF before you can sign."
                          : "Please scroll down to review the entire document before you can sign."}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="printedName" className="text-xs font-semibold">
                      Full Legal Name (Printed) *
                    </Label>
                    <Input
                      id="printedName"
                      value={printedName}
                      onChange={(e) => setPrintedName(e.target.value)}
                      placeholder="e.g. John Michael Doe"
                      required
                    />
                  </div>

                  <SignaturePad
                    ref={signaturePadRef}
                    onChange={(empty) => setSignatureEmpty(empty)}
                    height={130}
                  />

                  <div className="space-y-3 pt-2 border-t text-xs">
                    <div className="flex items-start space-x-2.5">
                      <Checkbox
                        id="reviewCheck"
                        checked={hasReviewedDoc}
                        onCheckedChange={(val) => setHasReviewedDoc(!!val)}
                      />
                      <Label
                        htmlFor="reviewCheck"
                        className="text-xs text-muted-foreground font-normal leading-snug cursor-pointer"
                      >
                        I confirm that I have carefully read and reviewed all pages and terms of this document.
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2.5">
                      <Checkbox
                        id="esignCheck"
                        checked={agreedToEsign}
                        onCheckedChange={(val) => setAgreedToEsign(!!val)}
                      />
                      <Label
                        htmlFor="esignCheck"
                        className="text-xs text-muted-foreground font-normal leading-snug cursor-pointer"
                      >
                        I consent to the use of electronic records and agree that my electronic signature is as legally binding as a handwritten pen signature.
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={!isFormValid}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Recording Signature...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Adopt &amp; Sign Document
                      </>
                    )}
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