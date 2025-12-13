/**
 * Navbar Component
 * 
 * Top navigation bar with links to Home, Incidents, and Profile pages.
 * Uses React Router for navigation.
 */

import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🎥</span>
          <span className="brand-text">Smart Surveillance</span>
        </div>
        
        <div className="navbar-links">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link 
            to="/incidents" 
            className={location.pathname === '/incidents' ? 'nav-link active' : 'nav-link'}
          >
            Incidents
          </Link>
          <Link 
            to="/profile" 
            className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
