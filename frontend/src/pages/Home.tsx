// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      {/* Hero Section – full Nova style */}
      <section className="py-5 py-lg-6 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}>
        <div className="container position-relative">
          <div className="row align-items-center">
            <div className="col-lg-7 text-center text-lg-start mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold text-white mb-4">
                Trade Forex with <span className="text-primary">Confidence</span>
              </h1>
              <p className="lead text-white-75 mb-5">
                Secure multi-currency wallets, real-time rates, instant conversions — NGN, USD, EUR and more.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <Link to="/register" className="btn btn-primary btn-lg px-5 rounded-pill fw-medium">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-5 rounded-pill fw-medium">
                  Login
                </Link>
              </div>
            </div>
            {/* <div className="col-lg-5 text-center">
              <img src="/nova-assets/images/hero-img-1-min.jpg" alt="Trading dashboard" className="img-fluid" />
            </div> */}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-dark">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="card bg-dark border-light shadow-sm h-100">
                <div className="card-body p-5">
                  <i className="bi bi-shield-check fs-1 text-primary mb-4 d-block"></i>
                  <h4 className="fw-bold mb-3">Secure Transactions</h4>
                  <p className="text-muted">Bank-grade encryption and OTP verification.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark border-light shadow-sm h-100">
                <div className="card-body p-5">
                  <i className="bi bi-graph-up fs-1 text-primary mb-4 d-block"></i>
                  <h4 className="fw-bold mb-3">Real-time Rates</h4>
                  <p className="text-muted">Live forex updates every few seconds.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-dark border-light shadow-sm h-100">
                <div className="card-body p-5">
                  <i className="bi bi-wallet2 fs-1 text-primary mb-4 d-block"></i>
                  <h4 className="fw-bold mb-3">Multi-Currency Wallets</h4>
                  <p className="text-muted">Hold & convert between multiple currencies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}