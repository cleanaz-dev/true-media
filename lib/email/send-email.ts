import { resend } from "@/lib/resend";
import { ReactElement } from "react";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement; // Accepts any React template component
  from?: string;
  replyTo?: string | string[];
}

export async function sendEmail({
  to,
  subject,
  react,
  from = process.env.EMAIL_FROM || "Contracts <noreply@yourdomain.com>", // Default fallback
  replyTo,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo,
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