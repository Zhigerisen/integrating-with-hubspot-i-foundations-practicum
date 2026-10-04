const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Secrets and config are loaded from .env and are never committed to the repo.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
// The custom object type id (e.g. "2-12345678"), kept in .env so the app stays portable.
const OBJECT_TYPE = process.env.OBJECT_TYPE;

// Validate required configuration at startup (fail fast with a clear message).
if (!PRIVATE_APP_ACCESS || !OBJECT_TYPE) {
    throw new Error('Missing config: set PRIVATE_APP_ACCESS_TOKEN and OBJECT_TYPE in your .env file (see README).');
}

const HUBSPOT_API = 'https://api.hubapi.com';
const PROPERTIES = ['name', 'sku', 'category', 'quantity', 'unit_price'];
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: read the custom object (Inventory Item) records and render them in a table.
app.get('/', async (req, res) => {
    const url = `${HUBSPOT_API}/crm/v3/objects/${OBJECT_TYPE}?limit=100&properties=${PROPERTIES.join(',')}`;
    try {
        const resp = await axios.get(url, { headers });
        const items = resp.data.results || [];
        res.render('homepage', { title: 'Inventory | Integrating With HubSpot I', items });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error loading inventory from HubSpot.');
    }
});

// ROUTE 2 - Render the form used to create a new Inventory Item record.
app.get('/inventory/new', (req, res) => {
    res.render('form', { title: 'Add inventory item | Integrating With HubSpot I' });
});

// ROUTE 3 - Create the custom object record in HubSpot, then redirect back to the homepage.
app.post('/inventory/new', async (req, res) => {
    const record = {
        properties: {
            name: req.body.name,
            sku: req.body.sku,
            category: req.body.category,
            quantity: req.body.quantity,
            unit_price: req.body.unit_price
        }
    };
    const url = `${HUBSPOT_API}/crm/v3/objects/${OBJECT_TYPE}`;
    try {
        await axios.post(url, record, { headers });
        res.redirect('/');
    } catch (error) {
        const status = error.response?.status;
        console.error(error.response?.data || error.message);
        if (status === 409) return res.status(409).send('An item with that unique value already exists.');
        if (status === 400) return res.status(400).send('Invalid input - please check the fields and try again.');
        res.status(500).send('Error creating the inventory item in HubSpot.');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
