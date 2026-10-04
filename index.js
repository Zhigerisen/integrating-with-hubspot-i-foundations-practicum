const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// The private app access token is loaded from .env and is never committed to the repo.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

const HUBSPOT_API = 'https://api.hubapi.com';
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1 - Homepage: read Contact records from the CRM and render them in a table.
app.get('/', async (req, res) => {
    const url = `${HUBSPOT_API}/crm/v3/objects/contacts?limit=50&properties=firstname,lastname,email,phone,company`;
    try {
        const resp = await axios.get(url, { headers });
        const contacts = resp.data.results;
        res.render('homepage', { title: 'Contacts | Integrating With HubSpot I', contacts });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error loading contacts from HubSpot.');
    }
});

// ROUTE 2 - Render the form used to create a new Contact record.
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Add a contact | Integrating With HubSpot I' });
});

// ROUTE 3 - Create the Contact in HubSpot, then redirect back to the homepage.
app.post('/update-cobj', async (req, res) => {
    const newContact = {
        properties: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            company: req.body.company
        }
    };
    const url = `${HUBSPOT_API}/crm/v3/objects/contacts`;
    try {
        await axios.post(url, newContact, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.status(500).send('Error creating the contact in HubSpot.');
    }
});

// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
