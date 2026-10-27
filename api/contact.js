// Contact form API — MongoDB removed; messages are sent directly to Formspree.

const ALLOWED_ORIGINS = new Set([
  'https://kt-portfolio-website.vercel.app'
]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, message: 5000 };
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwpnagrg';

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }
  return ALLOWED_ORIGINS.has(origin);
}

export default async function handler(req, res) {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    if (isAllowedOrigin(origin)) return res.status(200).end();
    return res.status(403).json({ error: 'Not allowed' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message, website } = req.body ?? {};

  // Honeypot spam protection
  if (website) {
    return res.status(200).json({ success: true });
  }

  // Validate the submitted fields
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (
    typeof email !== 'string' ||
    !EMAIL_PATTERN.test(email.trim())
  ) {
    return res.status(400).json({
      error: 'A valid email address is required'
    });
  }

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (name.trim().length > LIMITS.name) {
    return res.status(400).json({
      error: `Name must be under ${LIMITS.name} characters`
    });
  }

  if (email.trim().length > LIMITS.email) {
    return res.status(400).json({
      error: `Email must be under ${LIMITS.email} characters`
    });
  }

  if (message.trim().length > LIMITS.message) {
    return res.status(400).json({
      error: `Message must be under ${LIMITS.message} characters`
    });
  }

  try {
    // Send directly to Formspree. No MongoDB connection is required.
    const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        message: message.trim()
      })
    });

    if (!formspreeRes.ok) {
      const details = await formspreeRes.text();
      console.error('Formspree failed:', details);

      return res.status(502).json({
        error: 'Your message could not be sent. Please try again.'
      });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Contact form submission failed:', err);

    return res.status(502).json({
      error: 'Your message could not be sent. Please try again.'
    });
  }
}