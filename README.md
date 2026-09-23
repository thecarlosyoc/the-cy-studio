# the CY studio

Portfolio and studio site of Carlos Yoc, live at [www.thecystudio.com](https://www.thecystudio.com). Bilingual (ES/EN) case studies, about page and contact form, with a private CMS at `/admin`.

Stack: Nuxt 4 · Tailwind · Supabase (Postgres + Auth) · Cloudflare R2 · Resend · Vercel.

## Run locally

```bash
npm install --legacy-peer-deps
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:3000
```

Database schema: `supabase/schema.sql`.

## Docs

Project documentation (architecture, CMS, design system, decisions, operations) lives in Notion: [the CY studio · Portafolio](https://app.notion.com/p/3e4544fa0c0b81c8a0f3cb7b4e02e938).
