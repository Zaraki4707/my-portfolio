const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('.')); // serve files from root folder

// PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // required for Render
    },
});

// Redirect root to landing page (optional)
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { username, email, phoneNum, service, projectName, budget, intro } = req.body;

    if (!username || !email) return res.status(400).send('Name and email are required');

    try {
        await pool.query(
            `INSERT INTO clients(username, email, phoneNum, service, projectName, budget, intro, submittedAt)
             VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [username, email, phoneNum, service, projectName, budget, intro, new Date()]
        );

        console.log(`✅ New client submitted: ${username}`);
        res.redirect('/thankSubmit.html'); // redirect after submission
    } catch (err) {
        console.error('❌ Error saving client to database:', err);
        res.redirect('/thankSubmit.html'); // still redirect
    }
});

// Optional: view all clients (admin/testing)
app.get('/clients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clients ORDER BY submittedAt DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error fetching clients:', err);
        res.status(500).json({ error: 'Could not fetch clients' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;
