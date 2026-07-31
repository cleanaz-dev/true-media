// lib/email.ts
import { ReactElement } from 'react';
import { render } from 'react-email';
import { resend } from '@/lib/resend';
import { prisma } from '@/lib/prisma';

interface SendEmailParams {
  to: string;
  from: string;
  subject: string;
  template: ReactElement;
  userId?: string;
  templateSlug?: string;
}

export async function sendEmail({ 
  to, from, subject, template, userId, templateSlug 
}: SendEmailParams) {
  // 1. Render React to HTML
  const html = await render(template);

  // 2. Send via Resend
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  // 3. Log to DB (so client can view later)
  await prisma.emailLog.create({
    data: {
      to,
      from,
      subject,
      html, // Save the exact HTML
      userId,
      templateSlug,
      resendId: data?.id,
      status: error ? 'FAILED' : 'SENT',
    },
  });

  if (error) throw new Error(error.message);
  return data;
}
