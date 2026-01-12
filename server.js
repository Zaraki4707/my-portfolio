const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.post('/send-inquiry', inquiryLimiter, (req, res) => {
    console.log("📩 Received inquiry request:", req.body);
    const { name, email, phoneNum, service, projectName, budget, message } = req.body;

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Inquiry from ${name}`,
      text: `New message from your portfolio:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phoneNum}\nService: ${service}\nProject: ${projectName}\nBudget: ${budget}\n\nMessage:\n${message}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending owner email:", error);
        return res.status(500).send("Error sending email");
      }
      console.log("✅ Owner email sent:", info.response);

      // Automatically send confirmation email to the client
      const confirmationOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Message Received - Portfolio Inquiry",
        text: `Hi ${name},\n\nThank you for reaching out! I've received your request regarding "${projectName}".\n\nI'll be responding to your inquiry soon. If you don't hear from me within 24-48 hours, please feel free to reach out again.\n\nBest regards,\nYour Portfolio Team`
      };

      console.log("📨 Sending confirmation email to:", email);
      transporter.sendMail(confirmationOptions, (confError, confInfo) => {
        if (confError) {
          console.error("⚠️ Error sending confirmation email:", confError);
          // Still send success to user even if confirmation fails
        } else {
          console.log("✅ Confirmation email sent:", confInfo.response);
        }
        res.status(200).send("Success");
      });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

module.exports = app;

