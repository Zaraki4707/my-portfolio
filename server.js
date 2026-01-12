const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Database Configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase in many environments
  }
});

// Security Middleware - Relaxed CSP for development and inline scripts
app.use(helmet({
  contentSecurityPolicy: false,
}));

// General rate limiting: 100 requests per 15 minutes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Specific rate limiting for the inquiry form: 50 submissions per hour (Increased for testing)
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: "Too many inquiry attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || '*', 
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files safely
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Configure the Gmail Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Serve index.html as the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Explicit route for root-level index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/send-inquiry', inquiryLimiter, async (req, res) => {
    console.log("📩 Received inquiry request:", req.body);
    const { name, email, phoneNum, service, projectName, budget, message } = req.body;

    // --- Server-Side Validation ---
    const errors = [];
    if (!name || name.trim().length < 2) errors.push("Name is too short.");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.push("Invalid email address.");
    if (!message || message.trim().length < 5) errors.push("Message is too short.");
    if (!projectName || projectName.trim().length < 2) errors.push("Project name is required.");

    if (errors.length > 0) {
      console.warn("⚠️ Validation failed:", errors);
      return res.status(400).json({ errors });
    }

    try {
      // --- Store in Supabase ---
      console.log("💾 Storing inquiry in database...");
      const query = `
        INSERT INTO inquiries (name, email, phone_num, service, project_name, budget, message, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id;
      `;
      const values = [name, email, phoneNum, service, projectName, budget, message];
      
      const dbResult = await pool.query(query, values);
      console.log("✅ Data saved to Supabase with ID:", dbResult.rows[0].id);

      // --- Send Owner Email ---
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `🚀 New Project Inquiry: ${projectName}`,
        html: `
          
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("❌ Error sending owner email:", error);
          return res.status(500).send("Error sending email");
        }
        console.log("✅ Owner email sent:", info.response);

        // --- Automatically send confirmation email to the client ---
        const confirmationOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Inquiry Received - Zakaria's Portfolio",
          html: `
            <div style="background-color: #0a0a0a; background-image: radial-gradient(1px 1px at 20px 30px, #eee, transparent), radial-gradient(1px 1px at 40px 70px, #fff, transparent), radial-gradient(1px 1px at 90px 40px, #fff, transparent); background-size: 200px 200px; color: #ffffff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 0; margin: 0; width: 100%;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: rgba(17, 17, 17, 0.9); border-radius: 12px; border: 1px solid #333; overflow: hidden; box-shadow: 0 0 20px rgba(0, 210, 255, 0.1);">
                      <tr>
                        <td align="center" style="padding: 30px; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); border-bottom: 2px solid #00d2ff;">
                           <img src="cid:portfolioLogo" alt="Logo" style="width: 70px; height: 70px; margin-bottom: 15px; border-radius: 50%; border: 2px solid #00d2ff;">
                           <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Message Received</h1>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="color: #00d2ff; margin-top: 0;">Hello ${name},</h2>
                          <p style="color: #ccc; line-height: 1.8; font-size: 16px;">
                            Thank you for reaching out! I've successfully received your inquiry for <strong>${projectName}</strong>.
                          </p>
                          
                          <div style="margin: 30px 0; padding: 20px; border-left: 4px solid #00d2ff; background-color: #050505;">
                            <p style="margin: 0; color: #00d2ff; font-weight: bold; font-size: 14px; text-transform: uppercase;">Inquiry Summary:</p>
                            <p style="margin: 10px 0 0 0; color: #eee;"><strong>Service:</strong> ${service}</p>
                            <p style="margin: 5px 0 0 0; color: #eee;"><strong>Budget:</strong> ${budget}</p>
                          </div>

                          <p style="color: #ccc; line-height: 1.8; font-size: 16px;">
                            I'll personally review your project details and get back to you within 24-48 hours via email.
                          </p>

                          <div style="margin-top: 40px; text-align: center;">
                            <p style="color: #888; font-style: italic; margin-bottom: 20px;">Stay tuned,</p>
                            <p style="color: #ffffff; font-weight: bold; font-size: 18px; margin: 0;">Zakaria</p>
                            <p style="color: #00d2ff; font-size: 14px; margin: 5px 0 0 0;">Designer & Developer</p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #000; color: #444; font-size: 11px; letter-spacing: 1px;">
                          <p style="margin: 0;">&copy; 2026 ZAKARIA. ALL RIGHTS RESERVED.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          `,
          attachments: [{
            filename: 'my icon.png',
            path: path.join(__dirname, 'assets', 'my icon.png'),
            cid: 'portfolioLogo' 
          }]
        };

        console.log("📨 Sending confirmation email to:", email);
        transporter.sendMail(confirmationOptions, (confError, confInfo) => {
          if (confError) {
            console.error("⚠️ Error sending confirmation email:", confError);
          } else {
            console.log("✅ Confirmation email sent:", confInfo.response);
          }
          res.status(200).send("Success");
        });
      });
    } catch (dbError) {
      console.error("❌ Database error:", dbError);
      
      // If table doesn't exist, provide a helpful suggestion
      if (dbError.code === '42P01') {
        console.error("💡 The 'inquiries' table was not found. Please create it in your Supabase SQL Editor.");
      }
      
      return res.status(500).json({ 
        error: "Database storage failed", 
        message: dbError.message 
      });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;

