# octave-catalog

Octave Analytics Product Catalog — client-facing use case discovery platform.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Structure

```
catalog/          ← use case content (metadata.json + demo.html per use case)
src/              ← React frontend
api/              ← Vercel serverless functions
public/           ← static assets (demos copied here at build time)
```

## Adding a use case

1. Run your skill workflow to generate `demo.html`
2. Log into `/admin`, fill the form, upload the file
3. It commits to the `draft` branch automatically
4. Open a PR from `draft` → `main` and merge
5. Vercel redeploys — use case is live within 90 seconds

## Environment variables

Copy `.env.example` to `.env.local` and fill in your values.
