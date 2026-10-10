# Cartwright - Prochak Consultants

Static marketing site for CPC — film marketing and live experiences consultancy.

## Local preview

```bash
python3 -m http.server 3000
```

Open http://localhost:3000

## Deploy

Deployed on Vercel as a static site. Attach a custom domain in the Vercel project **Settings → Domains**.

After the domain is live, update the absolute URLs in `index.html` (canonical / Open Graph), `robots.txt`, and `sitemap.xml`.
