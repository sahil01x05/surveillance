/**
 * App Component
 * 
 * Main application component with React Router setup.
 * Provides navigation between Home, Incidents, and Profile pages.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Incidents from './pages/Incidents'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        {/* Global Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
