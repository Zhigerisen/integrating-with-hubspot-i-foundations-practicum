# Integrating With HubSpot I: Foundations - Practicum

A small Node.js / Express application that connects to a HubSpot developer test
account through the CRM API (using a private app access token) and manages a
custom object called **Inventory Item** - you can view all items and add new ones.

**HubSpot developer test account - Inventory Items (custom object) list:**
https://app-eu1.hubspot.com/contacts/149481377/objects/2-254394921/views/all/list

## The custom object
`Inventory Item` (objectType `2-254394921`) with properties: `name`, `sku`,
`category`, `quantity`, `unit_price`.

## What it does
- **GET `/`** - homepage: reads Inventory Item records from HubSpot and renders them in a table (`views/homepage.pug`).
- **GET `/inventory/new`** - renders a form to add a new inventory item (`views/form.pug`).
- **POST `/inventory/new`** - creates the record in HubSpot via the API, then redirects to the homepage.

## Run locally
1. `npm install`
2. Create a `.env` file in the project root:
   ```
   PRIVATE_APP_ACCESS_TOKEN=your-private-app-token
   OBJECT_TYPE=your-custom-object-type-id
   ```
3. `npm start` (or `node index.js`)
4. Open http://localhost:3000

The private app token and object id are loaded from `.env`, which is listed in
`.gitignore` and is never committed to the repository.
