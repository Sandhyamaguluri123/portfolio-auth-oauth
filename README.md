# Portfolio with Email Authentication and Google OAuth

This starter project uses your HTML/CSS portfolio and Supabase Auth. It includes email/password sign-in, account creation, Google OAuth sign-in, a session check for the portfolio page, and sign-out.

## Files
- `index.html` — sign-in and create-account UI
- `style.css` — styles for sign-in and portfolio
- `config.js` — your Supabase project URL and browser-safe anon/publishable key
- `auth.js` — email/password and Google OAuth flows
- `portfolio.html` — portfolio page
- `portfolio.js` — session guard and sign-out

## A. Create Supabase project
1. Create a project at https://supabase.com/dashboard.
2. Open Project Settings -> API (or API Keys).
3. Copy the Project URL and the anon/public or publishable key.
4. Put them into `config.js`. Do not use a service-role or secret key in browser code.

## B. Configure email authentication
1. In Supabase Dashboard, open Authentication -> Providers -> Email.
2. Enable Email provider.
3. For a real deployment, leave email confirmation enabled if appropriate and configure SMTP/email settings if Supabase requires it for your project.
4. Authentication -> URL Configuration: set Site URL to your deployed site origin, e.g. `https://YOUR-SITE.netlify.app`.
5. Add redirect URLs for local and production use:
   - `http://localhost:5500/index.html`
   - `http://localhost:5500/portfolio.html`
   - `https://YOUR-SITE.netlify.app/index.html`
   - `https://YOUR-SITE.netlify.app/portfolio.html`
   Replace the examples with your real URLs.

## C. Configure Google OAuth
1. In Google Cloud Console, create/select a project.
2. Configure the OAuth consent screen and fill the required app details.
3. Create an OAuth Client ID of type **Web application**.
4. In Supabase Dashboard -> Authentication -> Providers -> Google, enable Google and copy the Supabase callback URL shown there.
5. Add that exact callback URL to Google Cloud Console -> OAuth Client -> Authorized redirect URIs.
6. Copy the Google Client ID and Client Secret into the Supabase Google provider settings and save.
7. Add your local and deployed portfolio URLs to Supabase Authentication -> URL Configuration's allowed redirect URLs.
8. The Google OAuth client secret belongs only in Google/Supabase provider settings, never in `config.js` or frontend code.

## D. Run locally
1. Put all files in one folder.
2. Edit `config.js`.
3. In VS Code, install/use Live Server and open `index.html` with Live Server (usually `http://localhost:5500`). Or run `python -m http.server 8000` and use `http://localhost:8000`; add that URL to Supabase redirect allow-list if using it.
4. Test account creation, email confirmation if enabled, email/password sign-in, Google sign-in, protected portfolio access, and sign-out.

Do not open the page as a `file://` URL; use a local HTTP server.

## E. Deploy to Netlify
1. Create a GitHub repository and upload these project files (never upload private keys).
2. In Netlify, choose Add new site -> Import an existing project and connect the repository. For a static site, leave build command empty and publish directory as the repository root (`.`).
3. Deploy. Copy the final HTTPS URL, e.g. `https://YOUR-SITE.netlify.app`.
4. Add the production URL and `/index.html` and `/portfolio.html` redirect URLs to Supabase Authentication -> URL Configuration.
5. In Google Cloud Console, confirm the Supabase callback URL is listed as an Authorized redirect URI. Normally the OAuth callback remains the Supabase callback URL; the app destination is controlled by the allowed `redirectTo` URL.
6. Test in a private/incognito browser window.

## Security notes and limitations
- This is a frontend demo starter. A client-side page guard is not strong authorization: a user may still download static HTML or inspect files. Do not put private data in `portfolio.html`.
- For sensitive data, use a backend or Supabase Row Level Security (RLS) policies on database tables. Enforce authorization on the server/database, not only in JavaScript.
- Never expose service-role keys or Google client secrets in frontend files.
- If email confirmation is enabled, a new user may need to confirm their email before signing in.
- The account-creation button uses the email and password entered in the form; users should enter both fields before clicking it.
