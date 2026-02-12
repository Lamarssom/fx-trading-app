// src/pages/Home.tsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container text-center mt-5">  {/* Centered container with margin */}
      <div className="jumbotron bg-primary text-white p-5 rounded">  {/* Blue hero section */}
        <h1 className="display-4">Welcome to FX Trading App</h1>
        <p className="lead">Trade currencies easily — NGN ↔ USD and more.</p>
        <p>Register or login to start.</p>
      </div>
      <div className="mt-4">
        <Link to="/register">
          <button className="btn btn-primary btn-lg me-3">Register</button>  {/* Blue buttons */}
        </Link>
        <Link to="/login">
          <button className="btn btn-outline-primary btn-lg">Login</button>  {/* Outline variant */}
        </Link>
      </div>
    </div>
  );
}