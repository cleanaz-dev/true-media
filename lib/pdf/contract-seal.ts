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

  // Append a Certificate of Signature page at the end of the PDF
  const page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 page
  const { height } = page.getSize();

  let y = height - 50;

  // Title
  page.drawText("Certificate of Signature & Audit Trail", {
    x: 50,
    y,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  y -= 25;
  page.drawText(`Document: ${contractTitle}`, {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  y -= 40;

  // Stamp each signer
  for (const signer of signers) {
    page.drawText(`Signer: ${signer.name} (${signer.email})`, {
      x: 50,
      y,
      size: 12,
      font: boldFont,
    });
    y -= 16;

    const dateStr = signer.signedAt ? new Date(signer.signedAt).toISOString() : "N/A";
    page.drawText(`Signed on: ${dateStr} | IP: ${signer.ipAddress || "N/A"}`, {
      x: 50,
      y,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 18;

    // If they drew their signature (Base64 PNG)
    if (signer.signatureTxt && signer.signatureTxt.startsWith("data:image")) {
      try {
        const base64Data = signer.signatureTxt.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = Buffer.from(base64Data, "base64");
        const pngImage = await pdfDoc.embedPng(imageBytes);

        page.drawImage(pngImage, {
          x: 50,
          y: y - 45,
          width: 130,
          height: 45,
        });
        y -= 65;
      } catch (err) {
        console.error("Failed to embed signature image:", err);
        y -= 20;
      }
    } else if (signer.signatureTxt) {
      // If they typed their name
      page.drawText(`Signature: "${signer.signatureTxt}"`, {
        x: 50,
        y: y - 10,
        size: 12,
        font: font,
        color: rgb(0.1, 0.1, 0.5),
      });
      y -= 35;
    }
  }

  const completedPdfBytes = await pdfDoc.save();
  return Buffer.from(completedPdfBytes);
}