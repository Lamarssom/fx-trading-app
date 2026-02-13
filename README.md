#  FX Trading App (Full Stack)

A full-stack foreign exchange trading application that allows users to create accounts, manage multi-currency wallets, and perform real-time currency conversions securely.

Built with:
-  Backend: NestJS, TypeORM, PostgreSQL
-  Frontend: React (Create React App)
-  JWT Authentication
-  Real-time FX rate integration

Features

Authentication
- User registration
- OTP verification (console demo)
- JWT-based authentication
- Protected routes

Wallet System
- Multi-currency wallet per user
- Balance tracking per currency
- Transaction history logging

FX Trading
- Real-time FX rate fetching
- Currency conversion
- Atomic database transactions
- Rate caching for performance

Frontend
- User dashboard
- Wallet display
- Currency conversion UI
- Authentication flows

Architecture

- Frontend (React) => Backend API (NestJS) => PostgreSQL Database

Frontend Setup
- cd frontend
- npm install 
- npm start

Backend Setup
- cd backend
- npm install
- npm run start:dev

Add .env with :
- DB credentials
- JWT secret
- FX API key

Tech Stack
Frontend - React
Backend - NestJS
ORM - TypeORM
Database - PostgreSQL
Auth - JWT
Email - Nodemailer
Api Docs - Swagger

What This Project Demonstrates
- Rest API design 
- Secure authentication flows
- Financial transaction integrity
- State management between frontend and backend
- Full-stack architecture