const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve files from current directory

// Redirect root to landing page
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { username, email, phoneNum, service, projectName, budget, intro } = req.body;
    
    console.log('Form submitted:', { username, email, service });
    
    // Create client data object
    const clientData = {
        id: Date.now(),
        username,
        email,
        phoneNum,
        service,
        projectName,
        budget,
        intro,
        submittedAt: new Date().toISOString()
    };
    
    try {
        // Read existing clients or create empty array
        let clients = [];
        const filePath = path.join(__dirname, 'clients.json');
        
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            clients = JSON.parse(data);
        }
        
        // Add new client
        clients.push(clientData);
        
        // Save to file
        fs.writeFileSync(filePath, JSON.stringify(clients, null, 2));
        
        console.log(`✅ Client saved successfully: ${username}`);
        res.redirect('/thankSubmit.html');
        
    } catch (error) {
        console.error('❌ Error saving client data:', error);
        
        // If file saving fails, at least log the data and redirect
        console.log('Client data that failed to save:', clientData);
        res.redirect('/thankSubmit.html'); // Still redirect to thank you page
    }
});

// Optional: View clients (for local testing)
app.get('/clients', (req, res) => {
    try {
        const filePath = path.join(__dirname, 'clients.json');
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const clients = JSON.parse(data);
            res.json(clients);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.json({ error: 'Could not read clients data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Client data will be saved to clients.json`);
});

module.exports = app;