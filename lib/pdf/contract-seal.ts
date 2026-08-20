import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

interface SignerAudit {
  name: string;
  email: string;
  title?: string | null;
  signatureTxt: string | null;
  signedAt: Date | null;
  ipAddress?: string | null;
}

// =============================================================================
// COORDINATE MATH (US Letter, margins: x=2cm, top/bottom=2.5cm)
// Page: 612 × 792 pt
// Text area bottom: 70.87 pt from page bottom
// Signature block height: 243 pt (fixed in Typst)
// Right column x: 324 pt
// =============================================================================
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 56.69; // 2cm
const MARGIN_BOTTOM = 70.87; // 2.5cm
const RIGHT_COL_X = MARGIN_X + (PAGE_WIDTH - MARGIN_X * 2 - 36) / 2 + 36; // 324pt
const BLOCK_BOTTOM = MARGIN_BOTTOM; // block sits at bottom of text area

// Box bottoms within the right column (measured from page bottom)
const CLIENT_SIG_BOX_BOTTOM = BLOCK_BOTTOM + 32 + 14 + 32 + 14 + 42 - 30; // 175
const CLIENT_NAME_BOX_BOTTOM = BLOCK_BOTTOM + 32 + 14 + 32 - 20; // 129
const CLIENT_DATE_BOX_BOTTOM = BLOCK_BOTTOM + 32 - 20; // 83

export async function sealContractWithSignatures({
  originalPdfBuffer,
  signers,
  contractTitle,
}: {
  originalPdfBuffer: Buffer;
  signers: SignerAudit[];
  contractTitle: string;
}): Promise<Buffer> {
  const pdfDoc = await PDFDocument.load(originalPdfBuffer);
  const pages = pdfDoc.getPages();

  // The signature page is always the last page BEFORE we append the certificate
  const signaturePage = pages[pages.length - 1];
  const firstPage = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // ============================================================
  // 1. OVERLAY on Signature Page (last page)
  // ============================================================
  for (const signer of signers) {
    // --- Signature PNG inside the 30pt box ---
    if (signer.signatureTxt && signer.signatureTxt.startsWith("data:image")) {
      try {
        const base64Data = signer.signatureTxt.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const imageBytes = Buffer.from(base64Data, "base64");
        const pngImage = await pdfDoc.embedPng(imageBytes);

        const imgDims = pngImage.size();
        const maxW = 223; // col width minus padding
        const maxH = 26;  // box height minus padding
        const scale = Math.min(maxW / imgDims.width, maxH / imgDims.height, 1);

        signaturePage.drawImage(pngImage, {
          x: RIGHT_COL_X + 4,
          y: CLIENT_SIG_BOX_BOTTOM + 2,
          width: imgDims.width * scale,
          height: imgDims.height * scale,
        });
      } catch (err) {
        console.error("[sealContract] Signature image error:", err);
        signaturePage.drawText("[Signature Recorded]", {
          x: RIGHT_COL_X + 4,
          y: CLIENT_SIG_BOX_BOTTOM + 10,
          size: 10,
          font: italicFont,
          color: rgb(0.2, 0.2, 0.2),
        });
      }
    }

    // --- Printed Name & Title ---
    const nameTitle = signer.title
      ? `${signer.name}, ${signer.title}`
      : signer.name;

    signaturePage.drawText(nameTitle, {
      x: RIGHT_COL_X + 4,
      y: CLIENT_NAME_BOX_BOTTOM + 4,
      size: 9,
      font: boldFont,
      color: rgb(0.06, 0.06, 0.06),
    });

    // --- Date ---
    const dateStr = signer.signedAt
      ? new Date(signer.signedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

    signaturePage.drawText(dateStr, {
      x: RIGHT_COL_X + 4,
      y: CLIENT_DATE_BOX_BOTTOM + 4,
      size: 9,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  // ============================================================
  // 2. STAMP on FIRST PAGE
  // ============================================================
  const stampText = "SIGNED & SEALED";
  const stampSize = 42;
  const stampWidth = boldFont.widthOfTextAtSize(stampText, stampSize);

  firstPage.drawText(stampText, {
    x: PAGE_WIDTH - stampWidth - 50,
    y: PAGE_HEIGHT - 110,
    size: stampSize,
    font: boldFont,
    color: rgb(0.75, 0.1, 0.1),
    rotate: degrees(-18),
    opacity: 0.22,
  });

  // ============================================================
  // 3. CERTIFICATE PAGE (appended after signature page)
  // ============================================================
  const certPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = certPage.getSize().height - 50;

  certPage.drawText("Certificate of Signature & Audit Trail", {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.08, 0.08, 0.08),
  });

  y -= 20;
  certPage.drawText(`Document: ${contractTitle}`, {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  y -= 35;

  for (const signer of signers) {
    certPage.drawText(`Signer: ${signer.name} (${signer.email})`, {
      x: 50,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 16;

    const auditDate = signer.signedAt
      ? new Date(signer.signedAt).toISOString()
      : new Date().toISOString();

    certPage.drawText(
      `Signed on: ${auditDate} | IP: ${signer.ipAddress || "N/A"}`,
      {
        x: 50,
        y,
        size: 9,
        font,
        color: rgb(0.4, 0.4, 0.4),
      }
    );
    y -= 14;

    if (signer.signatureTxt && signer.signatureTxt.startsWith("data:image")) {
      try {
        const base64Data = signer.signatureTxt.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const imageBytes = Buffer.from(base64Data, "base64");
        const pngImage = await pdfDoc.embedPng(imageBytes);

        certPage.drawRectangle({
          x: 50,
          y: y - 55,
          width: 160,
          height: 50,
          borderColor: rgb(0.85, 0.85, 0.85),
          borderWidth: 1,
        });

        certPage.drawImage(pngImage, {
          x: 55,
          y: y - 50,
          width: 150,
          height: 40,
        });
        y -= 80;
      } catch (err) {
        console.error("[sealContract] Cert image error:", err);
        y -= 20;
      }
    } else {
      y -= 20;
    }

    y -= 15;
  }

  const completedPdfBytes = await pdfDoc.save();
  return Buffer.from(completedPdfBytes);
}