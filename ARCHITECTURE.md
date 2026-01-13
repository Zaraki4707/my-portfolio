# Project Architecture

## 📂 Directory Structure

```text
my-portfolio/
├── .env                # Local environment variables (ignored)
├── .gitignore          # Git exclusion rules
├── index.html          # Main landing page
├── package.json        # Node.js configuration & dependencies
├── server.js           # Express.js backend (Core Logic)
├── vercel.json         # Vercel deployment configuration
├── assets/             # Static images and favicons
├── css/                # Stylesheets
│   ├── cssOfPortfolio.css    # Portfolio main theme
│   └── styleOfClientPart.css # Client form specific styles
├── js/                 # Frontend interactivity
│   └── script.js       # Particles, mobile menu, and animations
└── pages/              # Secondary HTML views
    ├── about.html
    ├── Clientinfo.html # Inquiry form
    ├── contact.html
    ├── dev.html
    ├── graphic.html
    ├── projects.html
    ├── thankSubmit.html
    └── uiux.html
```

## 🛠 Technology Stack

- **Frontend**: HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel (Serverless Environment)
- **Email**: Nodemailer (Gmail SMTP)

## ⚙️ Core Components

1.  **Request Handling**: All routes are managed by `server.js` using Express routing.
2.  **Inquiry System**: Front-end validates data before sending a JSON payload to `/send-inquiry`.
3.  **Database Integration**: uses `pg` (node-postgres) to sink project inquiries into a Supabase table.
4.  **Auto-Responder**: Client receives an automated HTML confirmation email via Nodemailer.
