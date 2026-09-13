import { resend } from "@/lib/resend";
import { ReactElement } from "react";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement; // Accepts any React template component
  from?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  userId?: string | null;
  templateSlug?: string | null;
}

export async function sendEmail({
  to,
  subject,
  react,
  from = process.env.EMAIL_FROM || "Contracts <noreply@yourdomain.com>", // Default fallback
  replyTo,
  cc,
  bcc,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo,
      cc,
      bcc,
    });

    if (error) {
      console.error("[resend] Email send error:", error);
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (err) {
    console.error("[sendEmail] Failed to send email:", err);
    throw err;
  }
}