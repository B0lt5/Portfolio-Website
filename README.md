# Portfolio Website

A personal portfolio website for Ayoola Kitan — an aspiring web developer based in Lagos, Nigeria.

## Tech Stack

- **HTML / CSS / JavaScript** — static frontend (no framework)
- **Vercel serverless functions** — `/api/contact` handles the contact form
- **MongoDB (Mongoose)** — stores contact messages
- **Formspree** — forwards contact messages to email
- **Font Awesome** — icons
- **Vercel** — hosting & analytics

## Pages

| Page | Description |
|------|-------------|
| `index.html` | Home / hero |
| `aboutme.html` | About, education timeline, skills & interests |
| `blog.html` | Blog index (with search) |
| `project.html` | Project showcase + playable game preview modal |
| `contact.html` | Contact form (posts to `/api/contact`) |

## Running Locally

### Static site only

```bash
python3 -m http.server 8000
```

### With the contact API

1. Install dependencies: `npm install`
2. Set `MONGODB_URI` in a `.env` file at the project root
3. Run with the Vercel CLI: `npx vercel dev` (serves both static files and `/api/*`)

## Contact

Messages submitted through the contact page are saved to MongoDB and forwarded to
Formspree (which emails the owner). The API validates input server-side, restricts
CORS to the production origin, and uses a hidden honeypot field to discard bot traffic.