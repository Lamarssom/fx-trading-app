// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <div className="jumbotron text-center p-5 rounded shadow-lg">
        <h1 className="display-4 fw-bold mb-3">FX Trading App</h1>
        <p className="lead fs-4 mb-4">Secure, fast currency trading — NGN ↔ USD, EUR and more.</p>
        <p className="text-muted mb-5">Start trading with confidence today.</p>
      </div>
      <div className="d-flex justify-content-center gap-4 mb-4 flex-wrap">
        <span className="badge bg-success px-3 py-2 fs-6">Secure Transactions</span>
        <span className="badge bg-primary px-3 py-2 fs-6">Real-time Rates</span>
        <span className="badge bg-info px-3 py-2 fs-6">Multi-Currency Wallets</span>
      </div>
      <div className="mt-4">
        <Link to="/register">
          <button className="btn btn-primary btn-lg me-3">Register</button>
        </Link>
        <Link to="/login">
          <button className="btn btn-outline-primary btn-lg">Login</button>
        </Link>
      </div>
    </div>
  );
}