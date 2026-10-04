# Integrating With HubSpot I: Foundations — Practicum

A small Node.js / Express application that connects to a HubSpot developer test
account through the CRM API (using a private app access token) and lets you view
and add Contact records.

**HubSpot developer test account (Contacts list):**
https://app-eu1.hubspot.com/contacts/149481377/objects/0-1/views/all/list

## What it does
- **GET `/`** — homepage: reads Contact records from HubSpot and renders them in a table (`views/homepage.pug`).
- **GET `/update-cobj`** — renders a form to add a new contact (`views/updates.pug`).
- **POST `/update-cobj`** — creates the contact in HubSpot via the API, then redirects to the homepage.

## Run locally
1. `npm install`
2. Create a `.env` file in the project root with your private app token:
   ```
   PRIVATE_APP_ACCESS_TOKEN=your-token-here
   ```
3. `node index.js`
4. Open http://localhost:3000

The private app token is loaded from `.env`, which is listed in `.gitignore` and is never committed to the repository.
