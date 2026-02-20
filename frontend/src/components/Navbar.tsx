import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <header 
      className="fbs__net-navbar navbar navbar-expand-lg dark sticky-top shadow-sm"
      aria-label="Main navigation"
    >
      <div className="container d-flex align-items-center justify-content-between">
        
        {/* Nova Logo (light + dark versions — CSS auto-switches) */}
        <Link className="navbar-brand w-auto d-flex align-items-center" to="/">
          <img 
            className="logo dark img-fluid me-2" 
            src="/nova-assets/images/logo-dark.svg" 
            alt="FX Trading" 
            height="42"
          />
          <img 
            className="logo light img-fluid me-2" 
            src="/nova-assets/images/logo-light.svg" 
            alt="FX Trading" 
            height="42"
          />
          <span className="fw-bold fs-4 text-white">FX Trading</span>
        </Link>

        {/* Mobile toggler */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-3">
                <li className="nav-item">
                <NavLink 
                    className={({ isActive }) => `nav-link scroll-link ${isActive ? 'active' : ''}`}
                    to="/"
                >
                    Home
                </NavLink>
                </li>

                {token && (
                <li className="nav-item">
                    <NavLink 
                    className={({ isActive }) => `nav-link scroll-link ${isActive ? 'active' : ''}`}
                    to="/dashboard"
                    >
                    Dashboard
                    </NavLink>
                </li>
                )}
            </ul>

            <div className="ms-lg-4 d-flex align-items-center mt-3 mt-lg-0">
                {!token ? (
                <Link 
                    to="/register" 
                    className="btn btn-primary py-2 px-4 rounded-pill fw-medium"
                >
                    Get Started Free
                </Link>
                ) : (
                <button 
                    onClick={handleLogout}
                    className="btn btn-outline-light py-2 px-4 rounded-pill fw-medium"
                >
                    Logout
                </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
}