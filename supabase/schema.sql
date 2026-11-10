-- =============================================================================
-- KL PERFUMES — COMPLETE PRODUCTION SUPABASE DATABASE SETUP & RLS POLICIES
-- Review Status: Audited for Security, Performance & Anonymous-Read Compatibility
-- Run this entire script in Supabase Studio -> SQL Editor
-- =============================================================================

-- 1. Enable cryptographic functions
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 2. ADMIN ROSTER TABLE
-- -----------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Enable RLS immediately
alter table public.admins enable row level security;

-- Secure function to check if the current user is an administrator
-- Returns FALSE immediately if the user is anonymous (auth.uid() is null)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case
    when auth.uid() is null then false
    else exists (
      select 1 from public.admins where user_id = auth.uid()
    )
  end;
$$;

-- Revoke all by default, then grant execute to authenticated and anon
-- (Anon execution is completely safe as it always returns false, avoiding permission errors)
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Policy on admins table: Only verified administrators can view the admin roster
-- (NO insert/update/delete policies exist, preventing any client-side self-promotion)
drop policy if exists "Admins can read admin roster" on public.admins;
create policy "Admins can read admin roster"
  on public.admins for select to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. PRODUCTS TABLE (TRADITIONAL ATTARS & LUXURY OILS)
-- -----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text default 'KL Perfumes Atelier',
  category text not null default 'Pure Oud',
  description text,
  price numeric(12,2) not null check (price >= 0),
  original_price numeric(12,2) check (original_price is null or original_price >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  size text default '12ml (1 Tola)',
  sizes text[] default array['3ml (Quarter Tola)', '6ml (Half Tola)', '12ml (1 Tola)'],
  fragrance_type text,
  notes jsonb default '{}'::jsonb,
  image_url text,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Performance indices
create index if not exists idx_products_published_created
  on public.products (published, created_at desc);

create index if not exists idx_products_category
  on public.products (category);

create unique index if not exists idx_products_unique_name
  on public.products (name);

-- Enable RLS
alter table public.products enable row level security;

-- SEPARATE POLICIES FOR ANONYMOUS VS AUTHENTICATED
-- 1. Anonymous visitors: can ONLY read published products (zero is_admin call overhead)
drop policy if exists "Anon can read published products" on public.products;
drop policy if exists "Public can read published products" on public.products;
create policy "Anon can read published products"
  on public.products for select to anon
  using (published = true);

-- 2. Authenticated users: can read published products, while admins can read all (including drafts)
drop policy if exists "Authenticated can read products" on public.products;
create policy "Authenticated can read products"
  on public.products for select to authenticated
  using (published = true or public.is_admin());

-- 3. Admin write policies
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
  on public.products for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
  on public.products for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
  on public.products for delete to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. OFFERS & PROMOTIONS TABLE
-- -----------------------------------------------------------------------------
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint offers_valid_dates check (ends_at > starts_at)
);

create index if not exists idx_offers_active_dates
  on public.offers (active, starts_at, ends_at);

-- Enable RLS
alter table public.offers enable row level security;

-- SEPARATE POLICIES FOR ANONYMOUS VS AUTHENTICATED
-- 1. Anonymous visitors: can ONLY read active, non-expired offers
drop policy if exists "Anon can read active offers" on public.offers;
drop policy if exists "Public can read current offers" on public.offers;
create policy "Anon can read active offers"
  on public.offers for select to anon
  using (active = true and starts_at <= now() and ends_at >= now());

-- 2. Authenticated users: can read active offers or all offers if admin
drop policy if exists "Authenticated can read offers" on public.offers;
create policy "Authenticated can read offers"
  on public.offers for select to authenticated
  using ((active = true and starts_at <= now() and ends_at >= now()) or public.is_admin());

-- 3. Admin write policies
drop policy if exists "Admins can insert offers" on public.offers;
create policy "Admins can insert offers"
  on public.offers for insert to authenticated
  with check (public.is_admin());

drop policy if exists "Admins can update offers" on public.offers;
create policy "Admins can update offers"
  on public.offers for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can delete offers" on public.offers;
create policy "Admins can delete offers"
  on public.offers for delete to authenticated
  using (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. STORE SETTINGS TABLE (SINGLETON)
-- -----------------------------------------------------------------------------
create table if not exists public.store_settings (
  id integer primary key default 1 check (id = 1),
  business_name text not null default 'KL PERFUMES',
  whatsapp_number text not null default '919876543210',
  phone_number text not null default '+91 98765 43210',
  contact_email text not null default 'concierge@klperfumes.com',
  instagram_url text not null default 'https://instagram.com/klperfumes',
  announcement text not null default 'Artisanal Traditional Attars & Pure Fragrance Oils · 100% Alcohol-Free',
  store_description text not null default 'KL Perfumes is dedicated to traditional Arabic and Indian attar perfumery. Hand-distilled pure oils, rare oud, and royal amber crafted for fragrance connoisseurs.',
  address text not null default '',
  maps_embed_url text not null default '',
  maps_directions_url text not null default '',
  updated_at timestamptz not null default now()
);

-- Insert default singleton row if not present
insert into public.store_settings (id)
values (1)
on conflict (id) do nothing;

-- Enable RLS
alter table public.store_settings enable row level security;

-- Read policies: Publicly readable by all visitors
drop policy if exists "Anon can read store settings" on public.store_settings;
drop policy if exists "Public can read store settings" on public.store_settings;
create policy "Anon can read store settings"
  on public.store_settings for select to anon
  using (true);

drop policy if exists "Authenticated can read store settings" on public.store_settings;
create policy "Authenticated can read store settings"
  on public.store_settings for select to authenticated
  using (true);

-- Admin write policies
drop policy if exists "Admins can update store settings" on public.store_settings;
create policy "Admins can update store settings"
  on public.store_settings for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Admins can insert store settings" on public.store_settings;
create policy "Admins can insert store settings"
  on public.store_settings for insert to authenticated
  with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. STORAGE BUCKET: product-images (PUBLIC READ, ADMIN-ONLY WRITE)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB file size limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Public view policy: anyone can download or view product pictures
drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Anyone can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-images');

-- Admin write policies: only authenticated administrators may upload, edit or delete
drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. AUTOMATIC updated_at TIMESTAMPS
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists settings_set_updated_at on public.store_settings;
create trigger settings_set_updated_at
  before update on public.store_settings
  for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 8. INITIAL SEED DATA (16 TRADITIONAL ATTARS)
-- Uses ON CONFLICT (name) DO NOTHING to prevent duplicates on repeated runs
-- -----------------------------------------------------------------------------
insert into public.products (name, brand, category, fragrance_type, price, original_price, stock_quantity, size, notes, description, image_url, featured, published)
values
(
  'Oud Al Malik',
  'KL Perfumes Atelier',
  'Pure Oud',
  'Royal Agarwood & Leather',
  3499.00,
  4200.00,
  6,
  '12ml (1 Tola)',
  '{"top": "Aged Assam Agarwood, Saffron Petals", "heart": "Smoked Leather, Birch Resin, Tonka Bean", "base": "Dark Ambergris Accord, Black Musk"}'::jsonb,
  'A regal distillation of aged Assam agarwood and smoked birch. Deep, balsamic, and commanding with a dry honeyed undertone. A signature attar fit for kings.',
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'White Musk',
  'KL Perfumes Atelier',
  'Musk',
  'Velvet Floral Musk',
  1299.00,
  1650.00,
  14,
  '6ml (Half Tola)',
  '{"top": "Morning Lily, White Lotus", "heart": "Florentine Iris, Velvet White Musk", "base": "Soft Amber Crystals, Clean Cotton Blossom"}'::jsonb,
  'The epitome of tranquility and ethereal grace. A whisper-soft white musk that merges seamlessly with natural skin warmth, creating a clean, powdery veil that lasts all day.',
  'https://images.unsplash.com/photo-1608571424266-edeb9bbefdec?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Royal Amber',
  'KL Perfumes Atelier',
  'Amber & Woods',
  'Oriental Golden Amber',
  2699.00,
  3200.00,
  9,
  '12ml (1 Tola)',
  '{"top": "Cistus Labdanum, Sweet Orange Peel", "heart": "Warm Benzoin, Aged Madagascar Vanilla", "base": "Fossilized Amber, Cedarwood Essence"}'::jsonb,
  'Ancient amber resin slowly hydro-macerated with Bourbon vanilla and labdanum. Radiates an intoxicating golden warmth that wraps you in rich comfort.',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Dehn Al Oud',
  'KL Perfumes Atelier',
  'Pure Oud',
  'Pure Agarwood Oil',
  4999.00,
  5999.00,
  4,
  '3ml (Quarter Tola)',
  '{"top": "Wild Trat Agarwood Essence", "heart": "Sun-Dried Hay, Honeyed Bark, Resinous Wood", "base": "Earthy Balsam, Deep Animalic Warmth"}'::jsonb,
  'Pure, unadulterated artisanal agarwood oil distilled from wild Trat Aquilaria trees. Intensely complex, woodsy, and deeply spiritual with an incomparable longevity.',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Rose Taifi',
  'KL Perfumes Atelier',
  'Floral',
  'Mountain Taif Rose',
  2199.00,
  2799.00,
  8,
  '6ml (Half Tola)',
  '{"top": "Taif Rose Petals, Green Dew", "heart": "Damask Rose Absolute, Sweet Geranium", "base": "Wild Honeycomb, Sandalwood Fixative"}'::jsonb,
  'Prized Taif roses gathered at daybreak from Saudi Arabia’s mountain terraces. Hydro-distilled into a crisp, dew-drenched floral attar layered with sweet honeycomb undertones.',
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Sandalwood',
  'KL Perfumes Atelier',
  'Amber & Woods',
  'Pure Mysore Sandalwood',
  3199.00,
  3800.00,
  11,
  '12ml (1 Tola)',
  '{"top": "Sweet Cardamom, Green Cypress", "heart": "Creamy Mysore Sandalwood Heartwood", "base": "Balsamic Resins, Warm Driftwood"}'::jsonb,
  'Classical pure Santalum Album distilled using traditional deg & bhapka methods. Incomparably creamy, soothing, and buttery with an enduring sacred stillness.',
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Musk Al Tahara',
  'KL Perfumes Atelier',
  'Musk',
  'Pure White Cream Musk',
  999.00,
  1350.00,
  18,
  '6ml (Half Tola)',
  '{"top": "White Lotus, Delicate Lilac", "heart": "Creamy Vanilla, Powdery Rice Starch", "base": "Pristine Royal White Musk, Soft Cashmere"}'::jsonb,
  'The celebrated thick white cream attar of Arabian bridal traditions. Luxurious, milky, and intensely comforting. Clean, pristine, and exceptionally long-lasting on skin and robes.',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Black Oud',
  'KL Perfumes Atelier',
  'Pure Oud',
  'Smoked Dark Oud',
  3899.00,
  4600.00,
  5,
  '12ml (1 Tola)',
  '{"top": "Indonesian Black Agarwood, Clove Bud", "heart": "Frankincense Smoke, Roasted Cedar", "base": "Dark Amber, Earthy Patchouli, Castoreum Accord"}'::jsonb,
  'A dense, nocturnal attar evoking fragrant bakhoor embers and smoky Cambodian agarwood. Dark, hypnotic, and commanding an unforgettable presence in any room.',
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85',
  false,
  true
),
(
  'Arabian Nights',
  'KL Perfumes Atelier',
  'Special Blends',
  'Oriental Spicy Mukhallat',
  2899.00,
  3400.00,
  7,
  '12ml (1 Tola)',
  '{"top": "Saffron Threads, Bergamot, Mandarin", "heart": "Damascus Rose, Spiced Nutmeg, Oud Oil", "base": "Ambergris Accord, Black Musk, Patchouli"}'::jsonb,
  'An opulent royal mukhallat harmonizing saffron stigmas, Damascus rose, and vintage oud. Evokes starlit palace courtyards with rich, lingering trails of perfume.',
  'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'Majestic Oud',
  'KL Perfumes Atelier',
  'Pure Oud',
  'Ambered Oud',
  2499.00,
  2999.00,
  10,
  '6ml (Half Tola)',
  '{"top": "Zesty Bergamot, Fresh Coriander", "heart": "Sweet Cambodian Oud, Virginia Cedar", "base": "Golden Benzoin, Oakmoss, Amber"}'::jsonb,
  'Refined oud oil softened by golden spices and precious woods. An aristocratic, smooth composition tailored for both daily refinement and sacred occasions.',
  'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=900&q=85',
  false,
  true
),
(
  'Green Apple Attar',
  'KL Perfumes Atelier',
  'Citrus & Fresh',
  'Crisp Fruity Fresh',
  1199.00,
  null,
  15,
  '6ml (Half Tola)',
  '{"top": "Granny Smith Apple, Crushed Mint", "heart": "Dewy Lily of the Valley, Green Tea", "base": "Light Sandalwood, Transparent White Musk"}'::jsonb,
  'A contemporary fresh attar fusing crisp orchard green apple, fresh mint leaves, and white musk. Vivacious, uplifting, and beautifully persistent in warm weather.',
  'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=900&q=85',
  false,
  true
),
(
  'Blue Musk',
  'KL Perfumes Atelier',
  'Musk',
  'Aquatic Mineral Musk',
  1399.00,
  1750.00,
  12,
  '6ml (Half Tola)',
  '{"top": "Coastal Sea Air Accord, Ozone", "heart": "Blue Lotus, French Lavender", "base": "Sun-Bleached Driftwood, Pure Skin Musk"}'::jsonb,
  'The cool serenity of ocean breeze blended into concentrated perfume oil. Crisp, mineral, and invigorating with an intimate musk aura that keeps you refreshed for hours.',
  'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=900&q=85',
  false,
  true
),
(
  'Saffron Oud',
  'KL Perfumes Atelier',
  'Pure Oud',
  'Warm Spicy Oud',
  3299.00,
  3950.00,
  6,
  '12ml (1 Tola)',
  '{"top": "Pure Kashmiri Saffron, Pink Pepper", "heart": "Indian Dehn Al Oud, Dry Papyrus", "base": "Balsamic Amber, Aged Guaiac Wood"}'::jsonb,
  'Fine Kashmiri saffron stigmas married with aged Dehn Al Oud. Rich, intoxicating, and warm with golden leathery facets that evoke ancient caravan trading routes.',
  'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=900&q=85',
  true,
  true
),
(
  'White Oudh',
  'KL Perfumes Atelier',
  'Pure Oud',
  'Light Ethereal Oud',
  1899.00,
  2300.00,
  9,
  '6ml (Half Tola)',
  '{"top": "White Pepper, Sicilian Bergamot", "heart": "Delicate Pale Oud, White Magnolia", "base": "Crystalline Amber, Soft Cashmere Woods"}'::jsonb,
  'An ethereal, luminous oud crafted for everyday elegance. Bright white florals and white pepper open into a soft, airy woody resonance that never overwhelms.',
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85',
  false,
  true
),
(
  'Jasmine Bloom',
  'KL Perfumes Atelier',
  'Floral',
  'Pure Jasmine Sambac',
  1799.00,
  2150.00,
  11,
  '6ml (Half Tola)',
  '{"top": "Night-Blooming Jasmine Sambac", "heart": "Neroli, Sweet Orange Blossom, Ylang Ylang", "base": "Pure Sandalwood Oil Base"}'::jsonb,
  'Indian Motia (Jasmine Sambac) blossoms harvested before twilight and traditionally infused into sandalwood oil. Intensely heady, romantic, and deeply comforting.',
  'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=85',
  false,
  true
),
(
  'Velvet Amber',
  'KL Perfumes Atelier',
  'Amber & Woods',
  'Balsamic Sweet Amber',
  2599.00,
  3100.00,
  8,
  '12ml (1 Tola)',
  '{"top": "Ceylon Cinnamon Bark, Honeyed Plum", "heart": "Dark Amber Resin, Roasted Tonka", "base": "Madagascar Vanilla Pods, Dark Cocoa"}'::jsonb,
  'A decadent balsamic amber laced with spiced cinnamon, honeyed plum, and sweet Madagascar vanilla pods. Smooth as silk velvet, comforting as an antique shawl.',
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=85',
  false,
  true
)
on conflict (name) do nothing;

-- -----------------------------------------------------------------------------
-- 9. INITIAL SEED OFFER (IF NONE EXISTS)
-- -----------------------------------------------------------------------------
insert into public.offers (title, description, starts_at, ends_at, active)
select
  'A Moment to Indulge',
  'Complimentary 3ml pocket attar vial on all orders above ₹2,999.',
  now() - interval '1 day',
  now() + interval '365 days',
  true
where not exists (select 1 from public.offers limit 1);

-- -----------------------------------------------------------------------------
-- 10. ADMIN USER ONBOARDING INSTRUCTION (RUN AFTER CREATING AUTH USER)
-- -----------------------------------------------------------------------------
-- 1. Create your administrator account under Supabase Authentication -> Users.
-- 2. Copy the generated User UID.
-- 3. Run the following command in SQL Editor:
--    insert into public.admins (user_id) values ('PASTE-USER-UID-HERE');
