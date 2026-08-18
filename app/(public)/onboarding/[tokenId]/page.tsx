import { notFound } from "next/navigation";
import { getSignee } from "@/lib/actions/contracts/get-signee";
import { getPresignedUrl } from "@/lib/aws/s3";
import { SigneePage } from "@/components/admin/contracts/signee-page";

interface Params {
  params: Promise<{
    tokenId: string;
  }>;
}

export default async function Page({ params }: Params) {
  const { tokenId } = await params;

  const signee = await getSignee(tokenId);

  if (!signee) {
    return notFound();
  }

  // Generate presigned URL for viewing the PDF
  const s3KeyToView = signee.contract.completedS3Key || signee.contract.originalS3Key;
  let pdfUrl: string | null = null;

  if (s3KeyToView) {
    pdfUrl = await getPresignedUrl(s3KeyToView);
  }

  return <SigneePage signee={signee} pdfUrl={pdfUrl} />;
}