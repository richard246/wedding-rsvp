require('dotenv/config');

const express = require('express');
const { rateLimit } = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10kb' }));

app.post(
  '/api/rsvp',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  async (req, res) => {
    const rsvp = validateRsvp(req.body);
    if (!rsvp) {
      return res.status(400).json({ message: 'Please check your RSVP details and try again.' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RSVP_TO } = process.env;
    const RSVP_FROM = process.env.RSVP_FROM || SMTP_USER;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !RSVP_FROM || !RSVP_TO) {
      return res.status(503).json({
        message: 'Email is not set up yet. Please check back soon or contact the couple directly.',
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    try {
      await transporter.sendMail({
        from: RSVP_FROM,
        to: RSVP_TO,
        replyTo: rsvp.email,
        subject: `Royal Guest Registry: ${rsvp.fullName}`,
        text: [
          `Full name: ${rsvp.fullName}`,
          `Email: ${rsvp.email}`,
          `Telephone: ${rsvp.telephone}`,
          `Mailing address:\n${rsvp.mailingAddress}`,
          `Accompanied by a spouse or partner: ${rsvp.partnerStatus}`,
          `Accompanying guest name: ${rsvp.partnerName || 'Not provided'}`,
        ].join('\n'),
      });
      return res.status(200).json({ message: 'Thank you! Your RSVP has been sent.' });
    } catch (error) {
      console.error('Unable to deliver RSVP email:', error);
      return res.status(502).json({
        message: 'Your RSVP could not be delivered. Please try again later.',
      });
    }
  },
);

function validateRsvp(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;

  const { fullName, email, telephone, mailingAddress, partnerStatus, partnerName = '' } = body;
  if (
    typeof fullName !== 'string' ||
    !fullName.trim() ||
    fullName.trim().length > 100 ||
    typeof email !== 'string' ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof telephone !== 'string' ||
    !telephone.trim() ||
    telephone.trim().length > 40 ||
    typeof mailingAddress !== 'string' ||
    !mailingAddress.trim() ||
    mailingAddress.trim().length > 500 ||
    !['yes', 'no', 'undecided'].includes(partnerStatus) ||
    typeof partnerName !== 'string' ||
    partnerName.trim().length > 100
  ) {
    return null;
  }

  return {
    fullName: fullName.trim(),
    email: email.trim(),
    telephone: telephone.trim(),
    mailingAddress: mailingAddress.trim(),
    partnerStatus,
    partnerName: partnerName.trim(),
  };
}

if (require.main === module) {
  app.listen(port, () => {
    console.log(`RSVP email server listening on port ${port}`);
  });
}

module.exports = { app, validateRsvp };
