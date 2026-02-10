# FX Trading App Backend (CredPal Assessment)

Backend for FX Trading App allowing user registration/verification, multi-currency wallet management, real-time FX rate fetching, currency conversion/trading (NGN ↔ others), and transaction history.

## Tech Stack
- NestJS
- TypeORM + PostgreSQL
- JWT for auth
- In-memory caching for rates (bonus: Redis-ready)
- Nodemailer (console fallback for OTP in demo)

## Setup Instructions
1. Clone repo: git clone https://github.com/yourusername/repo.git
2. cd fx-trading-app
3. npm install
4. Create PostgreSQL DB: createdb fx_app (or via psql)
5. Copy .env.example to .env and fill values (DB creds, JWT_SECRET, FX_API_KEY)
6. npm run start:dev

## Key Assumptions
- OTP logged to console for demo/testing (real email sending optional per spec; uses Gmail SMTP config)
- FX rates from exchangerate-api.com v6; graceful fallback/hardcoded for NGN/USD if API fails
- Wallet: one row per currency per user (easy to query/extend)
- No payment gateway integration (funding simulated)
- synchronize: true in dev (use migrations in prod)

## API Documentation
Interactive Swagger: http://localhost:3000/api  
Postman collection: exported as fx-trading-app.postman_collection.json (included in repo)

## Architectural Decisions
- Modular NestJS structure (Auth, Wallet, Fx, Transaction modules)
- Services + repositories pattern
- Atomic transactions with QueryRunner (prevents double-spending)
- JWT + Guard for protected routes
- Caching rates (60s TTL)
- Scaling notes: add Redis for cache, BullMQ for async trades, DB sharding/replication, rate limiting, horizontal scaling with PM2/K8s for millions of users

## Testing
- Manual: via Postman/Swagger (all endpoints tested)
- Unit/Integration: encouraged but optional — basic wallet tests skeleton available

## Bonus Implemented
- Caching for FX rates
- Atomic balance updates
- Transaction history logging

## Future Extensions
- Real migrations
- Role-based access (admin)
- Redis caching
- Idempotency keys for transactions
- Analytics (trade volume, trends)