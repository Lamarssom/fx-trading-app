// src/pages/Register.tsx
import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

export default function Register() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', { email, password });

      setStep('verify');

      if (res.data.otp) {
        console.log('=== DEMO MODE OTP ===');
        console.log(`Email: ${email}`);
        console.log(`Your OTP: ${res.data.otp}`);
        console.log('This is for demo purposes only — expires in 10 minutes');
        console.log('=====================');

        toast.info(
          <div>
            <strong>Demo OTP:</strong> {res.data.otp}<br />
            Check console (F12) or copy from here. Expires in 10 min.
          </div>,
          { autoClose: false }
        );
      } else {
        alert('OTP sent! Check your email.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/verify', { email, otp });
      if (res.data.token) {
        setToken(res.data.token);
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/login';
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div 
      className="min-vh-100 d-flex align-items-center"
      style={{ 
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-10">
            <div 
              className="card border-0 shadow-lg overflow-hidden"
              style={{ borderRadius: '1.25rem' }}
            >
              <div className="card-body p-5 p-lg-6">
                {/* Header with logo – consistent branding */}
                <div className="text-center mb-5">
                  <img 
                    src="/nova-assets/images/logo-light.svg" 
                    alt="FX Trading" 
                    height="48" 
                    className="mb-3"
                  />
                  <h2 className="fw-bold mb-1">
                    {step === 'register' ? 'Create your account' : 'Verify your email'}
                  </h2>
                  <p className="text-muted">
                    {step === 'register' 
                      ? 'Join secure FX trading in minutes' 
                      : 'Enter the OTP sent to your email'}
                  </p>
                </div>

                {/* Error display – using Bootstrap alert for better visibility */}
                {error && (
                  <div className="alert alert-danger text-center mb-4" role="alert">
                    {error}
                  </div>
                )}

                {step === 'register' ? (
                  <form onSubmit={handleRegister}>
                    <div className="mb-4">
                      <label className="form-label fw-medium">Email address</label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-5">
                      <label className="form-label fw-medium">Password</label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 rounded-pill fw-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating account...
                        </>
                      ) : 'Register'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerify}>
                    <div className="mb-4">
                      <label className="form-label fw-medium">One-Time Password (OTP)</label>
                      <input
                        type="text"
                        className="form-control form-control-lg text-center"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg w-100 rounded-pill fw-medium"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Verifying...
                        </>
                      ) : 'Verify & Continue'}
                    </button>
                  </form>
                )}

                {/* Footer link – only show on register step */}
                {step === 'register' && (
                  <div className="text-center mt-4">
                    <p className="text-muted small mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-primary fw-medium text-decoration-none">
                        Sign in
                      </Link>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* subtle footer text */}
            <p className="text-center text-muted mt-4 small">
              © {new Date().getFullYear()} FX Trading – Secure & Simple
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}