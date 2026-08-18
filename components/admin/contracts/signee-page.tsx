"use client";

import { useState, useRef } from "react";
import { SigneeWithContract } from "@/lib/actions/contracts/get-signee";
import { submitSignature } from "@/lib/actions/contracts/submit-signature";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ExternalLink, FileCheck, Loader2, ShieldCheck, PenTool, FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { SignaturePad, SignaturePadRef } from "@/components/admin/contracts/signature-pad";

interface SigneePageProps {
  signee: SigneeWithContract;
  pdfUrl: string | null;
}

export function SigneePage({ signee, pdfUrl }: SigneePageProps) {
  const isAlreadySigned = signee.status === "SIGNED";

  // Form states
  const [printedName, setPrintedName] = useState(signee.name || "");
  const [hasReviewedDoc, setHasReviewedDoc] = useState(false);
  const [agreedToEsign, setAgreedToEsign] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSignedSuccessfully, setHasSignedSuccessfully] = useState(isAlreadySigned);

  // Mobile Tab State ("document" | "sign")
  const [mobileTab, setMobileTab] = useState<"document" | "sign">("document");

  // Signature pad ref
  const signaturePadRef = useRef<SignaturePadRef>(null);
  const [signatureEmpty, setSignatureEmpty] = useState(true);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        signatureImage,
      });

      setHasSignedSuccessfully(true);
      toast.success("Contract signed successfully!");
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
    !isSubmitting;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-background border-b px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
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
            <span className="hidden sm:inline">Open PDF</span>
            <span className="sm:hidden">PDF</span>
          </a>
        )}
      </header>

      {/* Mobile-Only Tab Switcher */}
      <div className="lg:hidden bg-background border-b px-4 py-2 flex gap-2 sticky top-[57px] z-10">
        <Button
          type="button"
          variant={mobileTab === "document" ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs gap-1.5"
          onClick={() => setMobileTab("document")}
        >
          <FileText className="w-3.5 h-3.5" />
          1. View Document
        </Button>
        <Button
          type="button"
          variant={mobileTab === "sign" ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs gap-1.5"
          onClick={() => setMobileTab("sign")}
        >
          <PenTool className="w-3.5 h-3.5" />
          2. Sign Document
        </Button>
      </div>

      {/* Main Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* PDF Viewer */}
        <div
          className={cn(
            "lg:col-span-7 h-[65vh] sm:h-[75vh] lg:h-[850px] bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col",
            mobileTab === "sign" ? "hidden lg:flex" : "flex"
          )}
        >
          {pdfUrl ? (
            <div className="relative w-full h-full flex flex-col">
              {/* Mobile notice banner to open full screen if iframe gives rendering issues */}
              <div className="lg:hidden bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900 px-3 py-2 text-xs flex items-center justify-between text-amber-900 dark:text-amber-200">
                <span>Trouble scrolling the document?</span>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium underline inline-flex items-center gap-1"
                >
                  Open in reader <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <iframe
                src={`${pdfUrl}#toolbar=0`}
                title="Contract Preview"
                className="w-full flex-1 border-0"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Document preview is currently unavailable.
            </div>
          )}
        </div>

        {/* Signing Card */}
        <div
          className={cn(
            "lg:col-span-5 space-y-6",
            mobileTab === "document" ? "hidden lg:block" : "block"
          )}
        >
          {hasSignedSuccessfully ? (
            <Card className="border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader className="text-center pb-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <CardTitle className="text-emerald-900 dark:text-emerald-100">
                  Document Signed &amp; Recorded
                </CardTitle>
                <CardDescription>
                  Thank you! Your signature has been legally recorded with a cryptographic audit trail.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-xs text-muted-foreground space-y-1 pt-2">
                <p>
                  <strong>Signed by:</strong> {printedName || signee.name}
                </p>
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {signee.signedAt ? new Date(signee.signedAt).toLocaleString() : new Date().toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PenTool className="w-5 h-5 text-primary" />
                  Review &amp; Sign
                </CardTitle>
                <CardDescription>
                  Complete your printed name, signature, and legal acknowledgements.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* 1. Printed Legal Name */}
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

                  {/* 2. Signature Pad */}
                  <SignaturePad
                    ref={signaturePadRef}
                    onChange={(empty) => setSignatureEmpty(empty)}
                    height={130}
                  />

                  {/* 3. Acknowledgements & Consent */}
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

                  {/* Submit Button */}
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