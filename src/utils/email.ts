// src/utils/email.ts

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const response = await fetch('/api/sendNotification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toEmail: to,
      subject,
      text,
      html,
    }),
  });

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    let message = `Failed to send email (status ${response.status})`;
    try {
      if (contentType.includes('application/json')) {
        const error = await response.json();
        message = error?.error || message;
      } else {
        const txt = await response.text();
        if (txt) message = txt;
      }
    } catch {}
    throw new Error(message);
  }

  try {
    if (contentType.includes('application/json')) {
      return await response.json();
    }
  } catch {}
  return { ok: true } as const;
} 