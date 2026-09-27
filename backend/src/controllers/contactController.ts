import type { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recipient = process.env.CONTACT_TO_EMAIL || 'brunofonnesu@live.it';

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function contact(req: Request, res: Response) {
  const { name, email: address, message, phone = '', arrivalDate = '', departureDate = '' } = req.body ?? {};
  if (!name || !address || !message) return res.status(400).json({ message: 'Name, email and message are required.' });
  if (!emailPattern.test(address)) return res.status(400).json({ message: 'Please enter a valid email address.' });
  if (String(message).trim().length < 10) return res.status(400).json({ message: 'Please add a little more detail to your message.' });
  if (arrivalDate && departureDate && arrivalDate >= departureDate) return res.status(400).json({ message: 'Departure must be after arrival.' });

  const { SMTP_HOST, SMTP_PORT = '587', SMTP_SECURE = 'false', SMTP_USER, SMTP_PASSWORD, SMTP_FROM_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD || !SMTP_FROM_EMAIL) {
    return res.status(503).json({ message: 'Email delivery is not configured.' });
  }

  const safe = {
    name: escapeHtml(name),
    address: escapeHtml(address),
    phone: escapeHtml(phone || 'Not provided'),
    arrivalDate: escapeHtml(arrivalDate || 'Not provided'),
    departureDate: escapeHtml(departureDate || 'Not provided'),
    message: escapeHtml(message).replaceAll('\n', '<br>'),
  };

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    });

    await transporter.sendMail({
      from: `Sa Corte Antiga <${SMTP_FROM_EMAIL}>`,
      to: recipient,
      replyTo: String(address),
      subject: `New Sa Corte Antiga enquiry from ${String(name)}`,
      text: [
        `Name: ${String(name)}`,
        `Email: ${String(address)}`,
        `Phone: ${String(phone || 'Not provided')}`,
        `Arrival: ${String(arrivalDate || 'Not provided')}`,
        `Departure: ${String(departureDate || 'Not provided')}`,
        '',
        String(message),
      ].join('\n'),
      html: `<h2>New Sa Corte Antiga enquiry</h2><p><strong>Name:</strong> ${safe.name}<br><strong>Email:</strong> ${safe.address}<br><strong>Phone:</strong> ${safe.phone}<br><strong>Arrival:</strong> ${safe.arrivalDate}<br><strong>Departure:</strong> ${safe.departureDate}</p><p>${safe.message}</p>`,
    });

    return res.status(201).json({ success: true, message: 'Thank you. Your enquiry has been sent.' });
  } catch (error) {
    console.error('Contact email delivery failed', error instanceof Error ? error.message : 'Unknown error');
    return res.status(502).json({ message: 'Unable to send' });
  }
}
