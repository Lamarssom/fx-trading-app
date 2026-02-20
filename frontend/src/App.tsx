// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ paddingTop: '90px', paddingBottom: '2rem' }}> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={localStorage.getItem('token') ? <Dashboard /> : <Login />} 
          />
        </Routes>
      </div>

      <ToastContainer position="top-right" />
    </Router>
  );
}

export default App;