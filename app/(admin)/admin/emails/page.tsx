// app/admin/emails/page.tsx (or wherever your route is)
import { AdminEmailPage } from "@/components/admin/email/admin-email-page";
import { getEmailData } from "@/lib/actions/get-email-data";

export default async function Page() {
  const emailData = await getEmailData();

  // Pass the { templates, logs } object directly
  return <AdminEmailPage emailData={emailData} />;
}
