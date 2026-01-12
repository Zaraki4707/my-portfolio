# Portfolio Integration Guide: SecAI Voting Platform

This document provides technical instructions for migrating this project or integrating it into a larger portfolio directory.

## 🚀 Integration Strategies

### Option 1: Standalone Project (Recommended)
Keep the project as a separate repository or a subdirectory in your portfolio collection. This is the cleanest way to maintain dependencies.

### Option 2: Project Inclusion
If you want to move the files into another React/Vite project, follow the steps below.

---

## 🛠 Step-by-Step Migration

### 1. File Transfer
Copy the following core folders to your target directory:
- `src/` (Entire source code)
- `public/` (Static assets like the logo)
- `supabase/` (Database schema for reference/setup)
- `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`

### 2. Dependency Matching
Ensure your portfolio project has the following packages installed. Run this command in your target folder:

```bash
npm install @supabase/supabase-js framer-motion lucide-react react-router-dom recharts
```

And for styling/build:
```bash
npm install -D tailwindcss postcss autoprefixer
```

### 3. Environment Configuration
The project uses Nodemailer for contact form inquiries. Create or update your `.env` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=3000
```

### 4. Tailwind Integration
If you are merging this into an existing Tailwind project, copy the `theme.extend` section from `tailwind.config.js` into your master config to preserve the "Cyber", "Quantum", and "Alert" color palettes and custom animations.

---

## 💎 Portfolio Showcase Highlights

When presenting this project in your portfolio, highlight these technical achievements:

1.  **Real-Time Data Sync**: Mention the use of Supabase's `postgres_changes` channel for live leaderboard updates without page refreshes.
2.  **Sophisticated UI/UX**: Highlight the "High-Tech Noir" aesthetic using Glassmorphism, Framer Motion for micro-interactions, and Lucide icons.
3.  **Modern Security**: Describe the implementation of Supabase Auth and PostgreSQL Row-Level Security (RLS) to protect admin endpoints.
4.  **Database Architecture**: Discuss the `rpc` (Remote Procedure Call) functions used to aggregate vote counts efficiently.
5.  **Type Safety**: The project is built with TypeScript, ensuring robust data handling across the frontend.

---

## 🌍 Deployment on Vercel
1.  Connect your repository to Vercel.
2.  Set the **Root Directory** to the project root.
3.  Add `EMAIL_USER` and `EMAIL_PASS` to Vercel's Environment Variables.
4.  Deployment Command: Vercel will auto-detect the Node.js server from `vercel.json`.

---

## 📝 Project Summary (For your Portfolio description)
**Title:** SecAI Voting Platform  
**The Hook:** A cyberpunk-themed engagement platform designed for a niche tech club.  
**The Tech:** React 18, TypeScript, Tailwind CSS, and Supabase.  
**Key Feature:** Real-time synchronization of voting results across nodes using database triggers and subscriptions.
