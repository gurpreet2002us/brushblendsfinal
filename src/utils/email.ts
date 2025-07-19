import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export async function sendEmail({ to, subject, text, html }: { to: string, subject: string, text?: string, html?: string }) {
  return resend.emails.send({
    from: 'Brush n Blends <support@brushnblends.com>',
    to: [to],
    subject,
    ...(text ? { text } : {}),
    ...(html ? { html } : {}),
  } as any);
} 