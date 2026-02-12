// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary"> 
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">FX Trading App</Link>  {/* Add a brand/logo */}
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
            </ul>
            <ul className="navbar-nav">
              {!token ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light" onClick={() => { 
                      localStorage.removeItem('token');
                      window.location.href = '/login';
                    }}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Login />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;