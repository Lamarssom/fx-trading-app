// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to FX Trading App</h1>
      <p>Trade currencies easily — NGN ↔ USD and more.</p>
      <p>Register or login to start.</p>

      <div style={{ margin: '2rem 0' }}>
        <Link to="/register">
          <button style={{ margin: '0 1rem', padding: '0.8rem 1.5rem' }}>Register</button>
        </Link>
        <Link to="/login">
          <button style={{ padding: '0.8rem 1.5rem' }}>Login</button>
        </Link>
      </div>
    </div>
  );
}