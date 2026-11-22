# Royal wedding registry

An Angular wedding guest registry in an ivory, parchment, and antique-gold style. The RSVP form submits to Formspree and collects name, email, telephone, mailing address, spouse/partner status, and an optional accompanying guest name.

## Run locally

1. Install Node.js (20.19+ is recommended) and run `npm install`.
2. Create a form in Formspree and copy its form ID.
3. Replace `YOUR_FORM_ID` in `src/app/app.ts` with that ID.
4. Run `npm start` to start the Angular site at `http://localhost:4200`.

Formspree handles RSVP delivery and notifications, so no Node API or SMTP credentials are needed. The form ID is part of the public endpoint; do not put private credentials in the Angular app. Review Formspree's current plan limits and data-retention terms before collecting guests' contact details.

## Host on GitHub Pages

Build the project site with `npm run build -- --base-href /wedding-rsvp/`, then publish `dist/wedding-rsvp/browser` using GitHub Actions. In the repository's **Settings → Pages**, choose **GitHub Actions** as the deployment source. If the repository name changes, update the base href to match its Pages URL.

## Personalize the registry

Edit `src/app/app.html` to replace `A & B`, `YOUR NAMES`, and `YOUR DATE` and adjust the invitation copy. The hero remains custom-generated; later venue sections use photos supplied in the `sample` folder.
