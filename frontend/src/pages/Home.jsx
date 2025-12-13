/**
 * Home Page Component
 * 
 * Landing page with project overview, system status, and call-to-action.
 * Displays camera status, AI monitoring status, and last detection time.
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()
  const [systemStatus, setSystemStatus] = useState({
    cameraConnected: false,
    aiMonitoring: true,
    lastDetection: null
  })

  // Check system status on mount
  useEffect(() => {
    checkSystemStatus()
    
    // Poll for status every 10 seconds
    const interval = setInterval(checkSystemStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const checkSystemStatus = async () => {
    try {
      // Try to fetch recent incidents to determine if camera is active
      const response = await fetch('http://localhost:8000/incidents')
      if (response.ok) {
        const incidents = await response.json()
        setSystemStatus({
          cameraConnected: true,
          aiMonitoring: true,
          lastDetection: incidents.length > 0 ? incidents[0].timestamp : null
        })
      }
    } catch (error) {
      // If backend is unreachable, show disconnected status
      setSystemStatus(prev => ({
        ...prev,
        cameraConnected: false
      }))
    }
  }

  const formatLastDetection = (timestamp) => {
    if (!timestamp) return 'No recent detections'
    
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minutes ago`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hours ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-icon">🛡️</span>
            Smart Surveillance & Public Safety
          </h1>
          <p className="hero-description">
            Advanced AI-powered monitoring system for real-time threat detection and public safety.
            Our intelligent surveillance platform uses cutting-edge computer vision to detect potential
            security incidents and alert authorities instantly.
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <span className="feature-icon">🤖</span>
              <span>AI-Powered Detection</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Real-Time Monitoring</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span>Smart Analytics</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Status Section */}
      <section className="status-section">
        <h2 className="section-title">System Status</h2>
        
        <div className="status-grid">
          {/* Camera Status */}
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">🎥</span>
              <h3>Camera Status</h3>
            </div>
            <div className="status-value">
              <span className={systemStatus.cameraConnected ? 'status-connected' : 'status-disconnected'}>
                {systemStatus.cameraConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
            <p className="status-description">
              {systemStatus.cameraConnected 
                ? 'All cameras are online and streaming' 
                : 'Camera connection unavailable'}
            </p>
          </div>

          {/* AI Monitoring */}
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">🤖</span>
              <h3>AI Monitoring</h3>
            </div>
            <div className="status-value">
              <span className={systemStatus.aiMonitoring ? 'status-active' : 'status-inactive'}>
                {systemStatus.aiMonitoring ? '✅ Active' : '⚠️ Inactive'}
              </span>
            </div>
            <p className="status-description">
              {systemStatus.aiMonitoring 
                ? 'Violence detection model is active' 
                : 'AI monitoring is currently disabled'}
            </p>
          </div>

          {/* Last Detection */}
          <div className="status-card">
            <div className="status-header">
              <span className="status-icon">⏰</span>
              <h3>Last Detection</h3>
            </div>
            <div className="status-value">
              <span className="status-time">
                {formatLastDetection(systemStatus.lastDetection)}
              </span>
            </div>
            <p className="status-description">
              Most recent incident detection timestamp
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Monitor Live Incidents</h2>
          <p>View real-time security incidents and threat assessments</p>
          <button 
            className="cta-button"
            onClick={() => navigate('/incidents')}
          >
            <span>View Live Incidents</span>
            <span className="cta-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}

export default Home
