const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve files from current directory

// Redirect root to landing page
app.get('/', (req, res) => {
    res.redirect('/landingpage.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { username, email, phoneNum, service, projectName, budget, intro } = req.body;
    
    // Create client data object
    const clientData = {
        id: Date.now(), // Simple ID using timestamp
        username,
        email,
        phoneNum,
        service,
        projectName,
        budget,
        intro,
        submitted_at: new Date().toISOString()
    };
    
    // Read existing clients or create empty array
    let clients = [];
    try {
        if (fs.existsSync('clients.json')) {
            const data = fs.readFileSync('clients.json', 'utf8');
            clients = JSON.parse(data);
        }
    } catch (err) {
        console.log('Creating new clients file...');
        clients = [];
    }
    
    // Add new client
    clients.push(clientData);
    
    // Save to file
    try {
        fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2));
        console.log(`New client saved: ${username}`);
        res.redirect('/thankSubmit.html');
    } catch (err) {
        console.error('Error saving client data:', err);
        res.send('<h1>Error saving your information. Please try again.</h1>');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});