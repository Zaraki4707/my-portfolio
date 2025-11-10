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

/*const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Email configuration
const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
        user: 'zakaria.pro.services@gmail.com',
        pass: 'your-gmail-app-password-here' // Replace with your Gmail app password
    }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve files from current directory

// Redirect root to landing page
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
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
        // Create email content
        const emailSubject = `New Client Submission: ${username}`;
        const emailBody = `
New client submission received:

📋 Client Details:
• Name: ${username}
• Email: ${email}
• Phone: ${phoneNum}
• Service: ${service}
• Project Name: ${projectName}
• Budget: ${budget}

💬 Introduction:
${intro}

🕒 Submitted At: ${new Date(clientData.submittedAt).toLocaleString()}
ID: ${clientData.id}
        `;

        // Email options
        const mailOptions = {
            from: 'zakaria.pro.services@gmail.com',
            to: 'zakaria.pro.services@gmail.com', // Your email where you want to receive notifications
            subject: emailSubject,
            text: emailBody,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Client Submission</h2>
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #555; margin-top: 0;">📋 Client Details</h3>
                    <p><strong>Name:</strong> ${username}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phoneNum}</p>
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Project Name:</strong> ${projectName}</p>
                    <p><strong>Budget:</strong> ${budget}</p>
                </div>
                
                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <h3 style="color: #555; margin-top: 0;">💬 Introduction</h3>
                    <p style="white-space: pre-wrap;">${intro}</p>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
                    <p style="margin: 0; color: #666;">
                        <strong>Submitted:</strong> ${new Date(clientData.submittedAt).toLocaleString()}<br>
                        <strong>ID:</strong> ${clientData.id}
                    </p>
                </div>
            </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully for client: ${username}`);
        res.redirect('/thankSubmit.html');
        
    } catch (error) {
        console.error('❌ Error sending email:', error);
        
        // Log the data even if email fails
        console.log('Client data that failed to email:', clientData);
        res.redirect('/thankSubmit.html'); // Still redirect to thank you page
    }
});

// Test email endpoint (optional - for testing email configuration)
app.get('/test-email', async (req, res) => {
    try {
        const mailOptions = {
            from: 'zakaria.pro.services@gmail.com',
            to: 'zakaria.pro.services@gmail.com',
            subject: 'Test Email from Your Server',
            text: 'This is a test email to verify your email configuration is working.',
            html: '<h2>Test Email</h2><p>Your email configuration is working correctly! 🎉</p>'
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Test email sent successfully!' });
    } catch (error) {
        console.error('Test email failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📧 Client data will be sent via email to: zakaria.pro.services@gmail.com`);
});

module.exports = app;