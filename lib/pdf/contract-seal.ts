import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

interface SignerAudit {
  name: string;
  email: string;
  signatureTxt: string | null;
  signedAt: Date | null;
  ipAddress?: string | null;
}

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
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add standard A4 Certificate Page
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { height } = page.getSize();

  let y = height - 50;

  // Header Title
  page.drawText("Certificate of Signature & Audit Trail", {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.08, 0.08, 0.08),
  });

  y -= 20;
  page.drawText(`Document: ${contractTitle}`, {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  y -= 35;

  // Render each signer's audit block
  for (const signer of signers) {
    page.drawText(`Signer: ${signer.name} (${signer.email})`, {
      x: 50,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 16;

    const dateStr = signer.signedAt
      ? new Date(signer.signedAt).toISOString()
      : new Date().toISOString();

    page.drawText(`Signed on: ${dateStr} | IP: ${signer.ipAddress || "N/A"}`, {
      x: 50,
      y,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 14;

    // Embed the drawn PNG signature image
    if (signer.signatureTxt && signer.signatureTxt.startsWith("data:image")) {
      try {
        const base64Data = signer.signatureTxt.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const imageBytes = Buffer.from(base64Data, "base64");
        const pngImage = await pdfDoc.embedPng(imageBytes);

        // Draw signature bounding box
        page.drawRectangle({
          x: 50,
          y: y - 55,
          width: 160,
          height: 50,
          borderColor: rgb(0.85, 0.85, 0.85),
          borderWidth: 1,
        });

        // Draw signature image inside box
        page.drawImage(pngImage, {
          x: 55,
          y: y - 50,
          width: 150,
          height: 40,
        });
        y -= 80;
      } catch (err) {
        console.error("[sealContract] Error embedding signature image:", err);
        page.drawText(`Signature: [Recorded Electronically]`, {
          x: 50,
          y: y - 15,
          size: 10,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        y -= 35;
      }
    } else {
      page.drawText(`Signature: "${signer.signatureTxt || signer.name}"`, {
        x: 50,
        y: y - 15,
        size: 11,
        font,
        color: rgb(0.1, 0.1, 0.5),
      });
      y -= 35;
    }
  }

  const completedPdfBytes = await pdfDoc.save();
  return Buffer.from(completedPdfBytes);
}