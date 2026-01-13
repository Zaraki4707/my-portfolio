# Security Report & Configuration

This document outlines the security measures implemented in the portfolio project to protect user data and server integrity.

## 🛡️ Implemented Security Measures

### 1. **Data Protection**
- **Environment Variables**: Sensitive credentials (DATABASE_URL, EMAIL_PASS) are stored in `.env` and never committed to version control.
- **SSL/TLS**: Database connections use SSL to ensure data in transit is encrypted.

### 2. **API Security**
- **Parameterized Queries**: All database interactions use placeholders (e.g., `$1, $2`) to prevent **SQL Injection** attacks.
- **Rate Limiting**: 
    - 100 req/15min for general browsing.
    - 50 req/1hr for contact form submissions to prevent bot spam.
- **CORS Management**: Configured via the `cors` middleware to restrict cross-origin requests to trusted origins.

### 3. **Header Security (Helmet.js)**
- Implementation of standard security headers:
    - `X-Content-Type-Options: nosniff`
    - `X-Frame-Options: SAMEORIGIN` (prevents Clickjacking)
    - `Strict-Transport-Security` (forces HTTPS)

## 📝 Ongoing Recommendations

1.  **CORS Lock-down**: Update `ALLOWED_ORIGIN` in production to match your Vercel URL.
2.  **Audit Logs**: Regularly check the Supabase logs for unusual insertion patterns.
3.  **Dependency Updates**: Run `npm audit` monthly to patch vulnerabilities in Express or Nodemailer.
