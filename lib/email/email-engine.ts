import { Resend } from 'resend';
import { render } from 'react-email'; // Corrected import
import Handlebars from 'handlebars';
import EmailSkeleton from './templates/email-skeleton';
import { prisma } from '../prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  templateSlug: string;
  data: Record<string, any>; 
  userId?: string; 
}

export async function sendDynamicEmail({ to, templateSlug, data, userId }: SendEmailParams) {
  // 1. Fetch the template from the database
  const template = await prisma.emailTemplate.findUnique({
    where: { slug: templateSlug }
  });

  if (!template) throw new Error(`Email template '${templateSlug}' not found.`);
  if (!template.isActive) return;

  try {
    // 2. Compile variables using Handlebars
    const compileSubject = Handlebars.compile(template.subject);
    
    // NOTE: Make sure you added `content String @db.Text` to your Prisma EmailTemplate model!
    const compileContent = Handlebars.compile(template.content);

    const finalSubject = compileSubject(data);
    const finalMarkdown = compileContent(data);

    // 3. Render the React-Email skeleton into HTML and plain text (Properly awaited)
    const html = await render: <EmailSkeleton compiledMarkdown={finalMarkdown} />;
    const text = await render: <EmailSkeleton compiledMarkdown={finalMarkdown} />, {
      plainText: true,
    });

    // 4. Send via Resend (sending raw HTML, ignoring Resend's hosted templates)
    const fromAddress = 'My Booking SaaS <no-reply@mybookingsaas.com>'; 
    
    const { data: resendResponse, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject: finalSubject,
      template: 
      text,
    });

    if (error) throw error;

    // 5. Log the success to the database
    await prisma.emailLog.create({
      data: {
        templateSlug,
        userId,
        to,
        from: fromAddress,
        subject: finalSubject,
        html, 
        text,
        status: 'SENT',
        resendId: resendResponse?.id,
      }
    });

    return resendResponse;

  } catch (error) {
    await prisma.emailLog.create({
      data: {
        templateSlug,
        userId,
        to,
        from: 'no-reply@mybookingsaas.com',
        subject: template.subject,
        html: 'FAILED TO RENDER OR SEND',
        status: 'FAILED',
      }
    });
    console.error('Email Engine Error:', error);
    throw error;
  }
}