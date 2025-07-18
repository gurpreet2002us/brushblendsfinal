import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toEmail, toPhone, subject, text, html, whatsappBody } = req.body;

  try {
    if (toEmail) {
      await sgMail.send({
        to: toEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject,
        text,
        html,
      });
    }

    if (toPhone) {
      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM,
        to: `whatsapp:${toPhone}`,
        body: whatsappBody,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ error: error.message });
  }
}