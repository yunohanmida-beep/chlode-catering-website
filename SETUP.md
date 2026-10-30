# Chlode Event Catering Services — Red, Yellow & White Premium Theme

This version uses **red, yellow, and white** to match the Chlode brand colors. It keeps the existing business name, tagline, contact details, service descriptions, packages, premium-style gallery with category filters, five visual package cards, inquiry form, admin login, and Supabase setup, while keeping scroll-reveal animations and a public customer review submission form with owner approval.

## Included files
- `index.html` — complete responsive website
- `styles.css` — cinematic premium theme and responsive styles
- `script.js` — Supabase integration, gallery, inquiry form, public reviews, moderation, admin login
- `config.js` — browser-safe Supabase project URL and publishable/anon key
- `supabase.sql` — schema and RLS policies, including pending public review submissions
- `assets/` — placeholder images because the original image folder was not included with the uploaded files. Replace these placeholders with the original Chlode photos/logo before publishing.

## 1. Set up Supabase
1. Open your Supabase project → **SQL Editor**.
2. If you already ran the old Chlode SQL, run the entire included `supabase.sql` again. It uses `create table if not exists` and refreshes the policies. It adds the public pending-review policy.
3. Open **Authentication → Users** and make sure the authorized admin account exists.
4. Copy that user's UID and ensure it is present in `public.admin_users`. If not, run:
   `insert into public.admin_users (user_id) values ('PASTE-AUTH-USER-UID-HERE');`
5. Never place an admin password or service-role/secret key in website files.

## 2. Configure `config.js`
Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` with your project's **Project URL** and **publishable key** (or legacy anon key). These are browser values; database security must come from RLS. Do not use a service-role key.

## 3. Restore the real business photos and logo
The uploaded files did **not** include the original `assets/` folder. The ZIP includes placeholder photos so the layout renders. Replace them with the actual Chlode logo and photos:
- `logo.png`
- `blue-event-setup.png`
- `buffet-service.png`
- `pink-event-setup.png`
- `family-collage.png`
- `debut-portrait.png`
- `buffet-guests-2.png`
- `pink-reception.png`

Additional gallery photo slots (8 images): `gallery-wedding-01.png`, `gallery-food-01.png`, `gallery-venue-01.png`, `gallery-debut-01.png`, `gallery-food-02.png`, `gallery-wedding-02.png`, `gallery-venue-02.png`, `gallery-debut-02.png`.

Package card photo slots (5 images): `package-birthday.png`, `package-wedding.png`, `package-debut.png`, `package-corporate.png`, `package-private.png`. See `assets/README.txt` for what each filename is for.

Keep the exact filenames so the site can find each image. The new gallery has category filters for Weddings, Birthdays & Debuts, Food & Buffet, and Venue Set-ups. The package cards use separate photos. Do not publish placeholder images as if they were real event photography.

## 4. Publish on GitHub Pages
1. Extract the ZIP.
2. Upload the **contents** of the folder (not the outer ZIP) to the root of your GitHub repository.
3. In GitHub → **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
4. Wait for the Pages URL and test the site on desktop and mobile.

## 5. Admin dashboard
Use the footer's **Admin login** link. The authorized admin can update the tagline, phone, email, Facebook, address, Maps URL and Google review URL; add genuine feedback; approve pending customer reviews; and delete reviews.

## 6. Public customer reviews
Visitors can submit a name, 1–5-star rating and feedback without signing in. Submissions are **not shown publicly until the owner approves them** in the admin dashboard. The browser includes a hidden honeypot and a basic one-minute per-session cooldown; these are only best-effort anti-spam measures, not strong bot protection. For a higher-traffic public form, use server-side rate limiting or CAPTCHA through a trusted backend.

The website does not invent a Google rating or pretend user-submitted reviews are Google reviews. The Google button opens the configured business review link. Update that link in the admin dashboard to the exact Google Business Profile review URL.

## 7. Inquiry form
The inquiry form prepares a message and opens the owner's Facebook page or an email draft. It does not send messages or store the inquiry automatically. The customer must finish and send the message in the chosen app.

## Before launch
- Replace all placeholder images with the original Chlode logo and real event photos.
- Verify the phone and email.
- Add the confirmed business address, Maps URL and Google review URL.
- Confirm the authorized admin UID is in `admin_users`.
- Test public review submission, approval and deletion while signed in as the admin.


## Existing Chlode photos and review form
This revision points the main hero, service, gallery, and package images to image files currently served by the existing Chlode website. This avoids using unrelated stock images, but those photos are remotely hosted rather than bundled as downloaded originals in this ZIP. Keep the source website assets available, or replace the image URLs with locally owned photo files later. The customer review summary and the separate “Have you celebrated with us?” submission form are included; public submissions are intended to remain hidden until owner approval.
