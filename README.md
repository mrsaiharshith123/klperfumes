# KL Perfumes

A premium, responsive perfume catalogue with product detail pages, WhatsApp enquiries, and a Supabase-backed admin dashboard.

## Stack

- React + Vite
- React Router
- Supabase Database, Auth and Storage
- Tailwind CSS (with a custom editorial CSS design system)
- Vercel-ready SPA deployment

## 1. Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
cp .env.example .env
npm run dev
```

The storefront includes sample catalogue data when Supabase credentials are not configured. The admin route will explain that credentials are required. Demo products are not written to your database.

## 2. Create and configure Supabase

1. Create a project at https://supabase.com/dashboard.
2. Open **SQL Editor** in the project.
3. Paste and run the full contents of `supabase/schema.sql`.
4. In **Project Settings → API**, copy the Project URL and the publishable/anon key.
5. Put them in `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

6. Restart Vite after changing `.env`.

Only the public anon/publishable key belongs in this frontend environment. **Never put the Supabase service_role key in a VITE_ variable or browser code.**

## 3. Create the first admin

1. In Supabase, open **Authentication → Users → Add user**.
2. Create the store owner's login email and password. Disable public signups in Authentication settings if the project does not need customer accounts.
3. Copy the new user's UUID.
4. In SQL Editor, run this, replacing the placeholder:

```sql
insert into public.admins (user_id)
values ('YOUR-AUTH-USER-UUID');
```

The `admins` table is not publicly writable. A signed-in user cannot grant themselves admin access. The dashboard calls the `is_admin()` database function before showing management tools.

## 4. Store setup

1. Sign in at `/admin` using the admin credentials.
2. Open **Store settings** and add the WhatsApp number with country code, e.g. `91XXXXXXXXXX` (digits only), contact email and Instagram URL.
3. Add products with accurate descriptions, prices, stock, size, fragrance family and product images.
4. Add time-bounded offers from the Offers tab.

WhatsApp enquiries use the product's name in a pre-filled message. No online checkout or payment collection is implemented.

## 5. Deploy to Vercel

1. Push this project to a private or public GitHub repository.
2. In Vercel, import the repository. Framework preset: **Vite**; build command `npm run build`; output directory `dist`.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel → Project → Settings → Environment Variables (Production, Preview and Development as needed).
4. Deploy.
5. In Vercel → Settings → Domains, add the purchased domain and follow the DNS records Vercel provides.

The included `vercel.json` rewrites app routes to `index.html`, so direct links such as `/product/<id>` and `/admin` work on refresh.

## Notes / production checklist

- RLS is enabled on every application table and the image bucket has public read/admin-only write policies.
- Product image uploads are limited to 5 MB and JPEG/PNG/WebP.
- Offers are displayed publicly only while active and inside their date range.
- Public product reads only return published items; admins can also see unpublished items in the dashboard.
- Configure a strong unique admin password and enable MFA in Supabase Auth where possible.
- Add real product photography and verify the business WhatsApp number before launch.
- Consider Supabase backups/retention settings and monitor free-tier limits as traffic grows.
- The offer manager currently creates offers and lists them; editing/deleting offers can be added as a follow-on admin feature.
