// src/pages/Login.tsx
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Login() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken } = response.data;
      setToken(newToken);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>  {/* Nova-like dark gradient */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7">
            <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '1.25rem' }}>
              <div className="card-body p-5 p-lg-6">
                <div className="text-center mb-5">
                  <img 
                    src="/nova-assets/images/logo-light.svg" 
                    alt="FX Trading" 
                    height="48" 
                    className="mb-3"
                  />
                  <h2 className="fw-bold mb-1">Welcome back</h2>
                  <p className="text-muted">Sign in to your trading account</p>
                </div>

                {error && <div className="alert alert-danger text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-medium">Email address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="form-label fw-medium">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 rounded-pill fw-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted small">
                    Don't have an account? <Link to="/register" className="text-primary fw-medium">Sign up</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}