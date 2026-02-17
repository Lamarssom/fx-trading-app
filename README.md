# FX Trading App (Full-Stack Fintech Demo)

A modern full-stack foreign exchange trading application that lets users register, verify via OTP email, manage multi-currency wallets, view live rates with charts, and simulate funding + conversions.

Live Demo: (coming soon — Vercel deployment in progress)

## Features

### Authentication & Security
- Email + password registration
- Real OTP verification via Resend (production-ready email delivery)
- JWT authentication & protected routes
- OTP expiry + secure in-memory store (Redis-ready for future)

### Wallet & Transactions
- Multi-currency wallets (NGN, USD, etc.)
- Atomic balance updates during conversions
- Full transaction history with type, rate, status, timestamp

### FX Trading & Rates
- Real-time exchange rates (via ExchangeRate-API)
- Auto-refresh every 60 seconds with direction indicator (↑ green / ↓ red)
- 30-day historical rate line chart (simulated data for free tier; backend proxy)
- Currency conversion with atomic DB transaction

### UI/UX Highlights
- Responsive Bootstrap 5 dashboard with tabs (Overview, Actions, History)
- Searchable currency dropdowns via react-select
- Mock Paystack payment modal for funding simulation (card inputs, success/failure paths, branding)
- Chart.js historical rate visualization
- Icons (bootstrap-icons) & fintech styling

### Tech Stack

Frontend
- React (Create React App)
- React Router, Bootstrap 5, react-select, Chart.js + react-chartjs-2, bootstrap-icons

Backend
- NestJS
- TypeORM + PostgreSQL
- JWT (passport-jwt)
- Cache Manager (in-memory)
- Resend (email OTP)
- ExchangeRate-API (real-time rates)

Other
- Axios for API calls
- Environment variables (.env)

## Setup Instructions

### Prerequisites
- Node.js ≥ 18
- PostgreSQL (local or hosted)
- Resend account (free tier) + API key
- ExchangeRate-API key (free tier)

### Backend
```bash
cd backend
npm install
# Create .env with:
# DATABASE_URL=postgresql://user:pass@localhost:5432/fx_trading
# JWT_SECRET=your-secret
# RESEND_API_KEY=re_xxxxxxxx
# EMAIL_FROM="FX Trading <onboarding@resend.dev>"
# FX_API_BASE_URL=https://v6.exchangerate-api.com/v6
# FX_API_KEY=your-api-key

npm run start:dev

Runs on https://loclahost:3000

Frontend

cd frontend
npm install
npm start

Runs on https:localhost:3001
