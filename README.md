<h1 align="center">📈 StockPilot</h1>

<p align="center"><em>A real-time stock tracking & market intelligence platform powered by AI-generated summaries, personalized news, and watchlist automation.</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232a?logo=react&logoColor=61dafb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/BetterAuth-000000?logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Finnhub_API-0052CC?logo=atlassian&logoColor=white" />
  <img src="https://img.shields.io/badge/Shadcn_UI-000000?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide-000?logo=lucide&logoColor=white" />
  <img src="https://img.shields.io/badge/Inngest-5A67D8?style=flat" />
</p>

---

## 📸 Project Screenshots

<p align="center">
  <img src="/public/screenshots/Landing-page.png" width="800" alt="Landing Page" />
</p>

<p align="center">
  <img src="/public/screenshots/LandingPage2.png" width="800" alt="Landing Page 2" />
</p>

<p align="center">
  <img src="/public/screenshots/Watchlist.png" width="800" alt="Watchlist Page" />
</p>

<p align="center">
  <img src="/public/screenshots/Stocks.png" width="800" alt="Watchlist Page" />
</p>

---

## 🚀 Overview

**StockPilot** is an intelligent stock market monitoring platform with:

- Real-time stock quotes
- AI-generated market summaries
- Personalized daily news (per-user)
- Fully functional watchlist
- Beautiful analytics widgets using TradingView
- Secure authentication powered by **BetterAuth**
- Background automations via **Inngest**

Simple. Powerful. Designed for everyday traders and long-term investors.

---

## 🌟 Features

### 🔐 **Authentication**
- Secure BetterAuth login (Email + OAuth providers)
- MFA-ready authentication flow
- Protected routes for user-specific actions

---

## 🧭 Authentication Workflows

To ensure a smooth and secure user experience, StockPilot includes fully automated and event-driven authentication flows.

### 🔐 Sign-Up Workflow (Event-Driven + Inngest Automation)

<p align="center">
  <img src="/public/screenshots/Sign-Up Workflow.png" alt="Sign Up Workflow" width="800">
</p>

### 🔑 Sign-In Workflow

<p align="center">
  <img src="/public/screenshots/Sign-In Workflow.png" alt="Sign In Workflow" width="800">
</p>

## 🗂 Watchlist Data Model

<p align="center">
  <img src="/public/screenshots/schema-diagram.png" alt="Watchlist Data Model" width="900" />
</p>

*Figure: Watchlist — users ⇆ watchlist ⇆ companies relationship (primary keys & symbol unique constraint).*



---

### ⭐ **Watchlist Management**
- Add/remove stocks instantly
- Optimistic UI updates
- Trash-icon removal
- Watchlist stored in MongoDB with user mapping
- Automatic revalidation of `/watchlist` route

### 📰 **Daily AI-Generated Market Summary**
- Inngest cron job runs daily
- Fetches user watchlist → retrieves news → summarizes using Gemini AI
- Sends email to each user with:
    - Market summary
    - Watchlist-specific news
    - Clean formatted email design

### 🔍 **Smart Stock Search**
- Fast fuzzy search using Finnhub `/search`
- Recent + popular stocks shown with caching
- Debounced search for high performance
- Beautiful CommandPalette (Shadcn) UI

### 📊 **TradingView Widgets Integration**
- Symbol Info
- Candlestick Chart
- Baseline Chart
- Technical Analysis
- Company Profile
- Financials

### 📈 **Stock Details Page**
- Live price
- Percentage change
- Market cap
- P/E ratio
- Daily/weekly performance
- Add/remove from watchlist
- Multiple rich TradingView widgets

### 📬 **Email System**
- Welcome email using AI personalization prompt
- Daily news email (Summarized via Gemini AI)
- Nodemailer + custom template support

### ⚙️ **Background Jobs (Inngest)**
- Daily cron job for news summary
- Event-based welcome email
- Scalable serverless execution

---

## 🗄️ **Tech Stack**

| Area | Technologies |
|------|--------------|
| **Frontend** | Next.js, React, Tailwind CSS, Shadcn UI |
| **Backend** | Node.js (Next.js server actions), BetterAuth |
| **Database** | MongoDB (Mongoose) |
| **Auth** | BetterAuth + Protected Routes |
| **API** | Finnhub API |
| **Email** | Nodemailer + Templates |
| **Automation** | Inngest (Cron + Event functions) |
| **Charts** | TradingView Widgets |
| **Icons** | Lucide React |

---

## 📦 **Project Structure**

| Path | Description |
|------|-------------|
| `app/(root)/stocks/[symbol]/page.jsx` | Full stock details page with TradingView widgets |
| `app/(root)/watchlist/page.jsx` | Watchlist UI |
| `components/SearchCommand.jsx` | Search + Command palette |
| `components/WatchlistButton.jsx` | Add/remove watchlist logic |
| `components/WatchlistTable.jsx` | Watchlist table UI |
| `lib/actions/*` | All server actions (watchlist, stock data, news) |
| `lib/inngest/*` | Inngest client + functions |
| `database/mongoose.js` | MongoDB connection with global caching |
| `database/models/watchlist.models.js` | Watchlist schema |
| `styles/globals.css` | Custom Tailwind styles |

---

## ⚙️ **Workflow Summary**

### ▶️ User Sign-Up
✔️ BetterAuth → event triggers Inngest → Gemini AI generates personalized intro → welcome email sent.

### ▶️ User Adds Stock to Watchlist
✔️ API → MongoDB entry → UI updates → Page revalidated.

### ▶️ Daily Summary
✔️ Inngest cron → fetch per-user watchlist → fetch news → summarize → send email.

### ▶️ Searching Stocks
✔️ Debounced search → Finnhub API → cached responses → displayed in command menu.

### ▶️ Viewing Any Stock
✔️ Fetch quote, profile, metrics → display multiple TradingView widgets → watchlist toggle.

---

## 🧑‍💻 **Local Setup**

### 🔹 Clone Repo
```bash
git clone https://github.com/swarnabha-dutta/stock_pilot.git
cd stock_pilot
```

### 🔹 Install Dependencies
```bash
npm install
```

### 🔹 Configure Environment
Create `.env`:
```
MONGODB_URL=your_mongodb_url
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_key
FINNHUB_API_KEY=your_finnhub_key
BETTER_AUTH_SECRET=your_secret
EMAIL_SERVER_USER=your_email
EMAIL_SERVER_PASSWORD=your_password
```

### 🔹 Run Dev Server
```bash
npm run dev
```

---

## 🧩 Future Enhancements

* Realtime price updates (WebSockets)
* AI-based stock sentiment analysis
* Portfolio tracking module
* Alerts + notifications through email/SMS
* Multi-currency support
* Revenue dashboard (admin)

---

## 📬 Contact

👤 **Developer:** Swarnabha Dutta  
📧 Email: [swarnabhadutta909@gmail.com](mailto:swarnabhadutta909@gmail.com)  
🔗 LinkedIn: https://www.linkedin.com/in/swarnabhadutta909/  
🌐 Portfolio: https://animated-3-d-portfolio.vercel.app/

---

<p align="center">Made with ❤️ by Swarnabha Dutta — Empowering smarter investments.</p>
