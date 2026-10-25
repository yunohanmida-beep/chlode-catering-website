# Chlode Event Catering Services website

Responsive static website built with HTML, CSS and JavaScript for GitHub Pages, with Supabase Auth + database for admin-managed business details and customer feedback.

## Files
- `index.html` — website and admin login
- `styles.css` — responsive red, gold, and cream design
- `script.js` — gallery, contact inquiry, Supabase reads/writes, admin login
- `config.js` — Supabase browser URL/key configuration
- `supabase.sql` — database tables and row-level security policies
- `assets/` — the photos/logo supplied for this website

## 1. Set up Supabase
1. Open your Supabase project → **SQL Editor**.
2. Paste all of `supabase.sql` and run it.
3. Open **Authentication → Users** and create an admin user with an email/password you control. Do not put that password in any website file.
4. Copy that user's **UID**.
5. In SQL Editor, run the final `insert into public.admin_users...` statement from the bottom of `supabase.sql`, replacing the placeholder with the UID. Keep the single quotes around the UUID.
6. Open **Project Settings → API** (or the API keys page). Copy the **Project URL** and the **publishable key** (or legacy anon key). Never use the `service_role` key or any secret key in frontend code.

## 2. Configure the website
1. Open `config.js`.
2. Replace `YOUR_SUPABASE_PROJECT_URL` with your Supabase Project URL.
3. Replace `YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY` with the publishable/anon key.
4. Save the file. The publishable/anon key is meant for browser use; security comes from the RLS policies. Never expose your Supabase password or service-role key.

## 3. Publish to GitHub Pages
1. Create a GitHub repository, for example `chlode-catering`.
2. Upload the contents of this folder (upload `index.html`, `styles.css`, `script.js`, `config.js`, `supabase.sql`, `SETUP.md`, and the `assets` folder; do not upload the outer zip).
3. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. Wait for the published URL and open it. The site can run without Supabase, but login and database-managed content require the config values.

## 4. Configure actual business details
- The phone and email are transcribed from the supplied contact card; please verify them before publishing.
- Enter the confirmed physical address and correct Google Maps directions URL in the Admin dashboard.
- The provided Facebook URL is prefilled as `https://www.facebook.com/SheenaMNA#`.
- The location shown in the first draft is a generic Google Maps search until the owner supplies the exact business listing/location link.
- The website does not invent Google star ratings or reviews. The admin can publish genuine customer feedback. To show Google Business Profile reviews dynamically, the owner must provide the exact Google Business Profile / Place ID and configure a supported Google Places API integration. Do not put an unrestricted Google API key in the frontend.

## 5. Admin login
Open the public website → footer → **Admin login**. Sign in with the Supabase Auth user you created. You can edit the business tagline, contact details, Facebook, address and map/review links, and publish/delete genuine customer feedback.

## Inquiry form
The inquiry form prepares a message and opens either Facebook or an email draft. It does not send messages or store personal information on the site by itself.

## Before launch
- Verify phone/email from the original card.
- Add the real address and Google Maps business listing.
- Add the real Google review URL / Place ID if dynamic Google reviews are required.
- Test admin sign-in and database policies before sharing the site publicly.
