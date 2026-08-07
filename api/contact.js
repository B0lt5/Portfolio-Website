import mongoose from 'mongoose';

// Contact schema
const contactSchema = new mongoose.Schema({
  name:      { type: String, required: true, maxlength: 100 },
  email:     { type: String, required: true, maxlength: 254 },
  message:   { type: String, required: true, maxlength: 5000 },
  createdAt: { type: Date, default: Date.now }
});

// Prevent model recompilation in serverless environments
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

// Only allow requests originating from the portfolio site itself.
// If you add a custom domain or a staging domain, add it here.
const ALLOWED_ORIGINS = new Set(['https://kt-portfolio-website.vercel.app']);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 100, email: 254, message: 5000 };

function isAllowedOrigin(origin) {
  if (!origin) return false;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  return ALLOWED_ORIGINS.has(origin);
}

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000
  });
}

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // CORS preflight
  if (req.method === 'OPTIONS') {
    if (isAllowedOrigin(origin)) return res.status(200).end();
    return res.status(403).json({ error: 'Not allowed' });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, message, website } = req.body ?? {};

  // Honeypot: genuine visitors never see or fill this hidden field.
  // Reply with success so bots never realise they were caught, then discard.
  if (website) {
    return res.status(200).json({ success: true });
  }

  // Server-side validation — never trust checks made in the browser.
  if (typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }
  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (name.length > LIMITS.name) {
    return res.status(400).json({ error: `Name must be under ${LIMITS.name} characters` });
  }
  if (email.length > LIMITS.email) {
    return res.status(400).json({ error: `Email must be under ${LIMITS.email} characters` });
  }
  if (message.length > LIMITS.message) {
    return res.status(400).json({ error: `Message must be under ${LIMITS.message} characters` });
  }

  try {
    await connectDB();

    // 1. Save to MongoDB
    await Contact.create({ name: name.trim(), email: email.trim(), message: message.trim() });

    // 2. Forward to Formspree (native fetch — no dependency needed)
    const formspreeRes = await fetch('https://formspree.io/f/xwpnagrg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ name, email, message })
    });

    if (!formspreeRes.ok) {
      console.error('Formspree failed:', await formspreeRes.text());
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}