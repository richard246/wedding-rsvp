# Royal wedding registry

An Angular wedding guest registry in an ivory, parchment, and antique-gold style, with a small Node email API. The registry collects name, email, telephone, mailing address, spouse/partner status, and an optional accompanying guest name.

## Run locally

1. Install Node.js (20.19+ is recommended) and run `npm install`.
2. Run `npm start` to start the Angular site at `http://localhost:4200` and the RSVP API at port 3000.
3. Before sending real emails, copy `.env.example` to `.env` and add your mail provider's SMTP settings and destination address. Keep `.env` private; it is ignored by Git. Until these settings are present, the form will tell guests that email is not configured.

Email is sent by the server, not directly from the browser. The sender address must be allowed by your SMTP provider. For production, deploy the Angular app and API behind the same domain and provide the SMTP values through your hosting provider's environment settings.

## Personalize the registry

Edit `src/app/app.html` to replace `A & B`, `YOUR NAMES`, and `YOUR DATE` and adjust the invitation copy. The hero remains custom-generated; later venue sections use photos supplied in the `sample` folder.
