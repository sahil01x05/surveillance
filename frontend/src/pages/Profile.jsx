/**
 * Profile Page Component
 * 
 * Static user profile page for MVP demonstration.
 * Displays user information, role, connected cameras, and preference settings (UI only).
 */

import { useState } from 'react'
import './Profile.css'

function Profile() {
  // State for preference toggles (UI only - no backend integration)
  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    emailAlerts: true,
    soundAlerts: false,
    alertSeverity: 'medium'
  })

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="profile-page">
      {/* Page Header */}
      <div className="profile-header">
        <h1 className="page-title">👤 User Profile</h1>
      </div>

      <div className="profile-content">
        {/* User Information Card */}
        <section className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
          </div>
          <div className="card-body">
            <div className="profile-avatar">
              <div className="avatar-circle">
                <span className="avatar-icon">👤</span>
              </div>
            </div>
            
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Full Name</label>
                <p className="info-value">System Admin</p>
              </div>
              
              <div className="info-item">
                <label className="info-label">Role</label>
                <p className="info-value role-badge">System Monitor</p>
              </div>
              
              <div className="info-item">
                <label className="info-label">Email Address</label>
                <p className="info-value">admin@surveillance-demo.com</p>
              </div>
              
              <div className="info-item">
                <label className="info-label">User ID</label>
                <p className="info-value">#ADMIN-001</p>
              </div>
            </div>
          </div>
        </section>

        {/* System Access Card */}
        <section className="profile-card">
          <div className="card-header">
            <h2>System Access</h2>
          </div>
          <div className="card-body">
            <div className="access-grid">
              <div className="access-item">
                <div className="access-icon">🎥</div>
                <div className="access-info">
                  <span className="access-label">Connected Cameras</span>
                  <span className="access-value">3 Active</span>
                </div>
              </div>
              
              <div className="access-item">
                <div className="access-icon">🔐</div>
                <div className="access-info">
                  <span className="access-label">Access Level</span>
                  <span className="access-value">Full Administrator</span>
                </div>
              </div>
              
              <div className="access-item">
                <div className="access-icon">📊</div>
                <div className="access-info">
                  <span className="access-label">Dashboard Access</span>
                  <span className="access-value">All Zones</span>
                </div>
              </div>
              
              <div className="access-item">
                <div className="access-icon">⏰</div>
                <div className="access-info">
                  <span className="access-label">Last Login</span>
                  <span className="access-value">Today, 9:30 AM</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Card */}
        <section className="profile-card">
          <div className="card-header">
            <h2>Notification Preferences</h2>
            <span className="card-subtitle">Configure your alert settings</span>
          </div>
          <div className="card-body">
            {/* Notifications Toggle */}
            <div className="preference-item">
              <div className="preference-info">
                <h3 className="preference-title">Push Notifications</h3>
                <p className="preference-description">
                  Receive real-time alerts for security incidents
                </p>
              </div>
              <button 
                className={`toggle-switch ${preferences.notificationsEnabled ? 'active' : ''}`}
                onClick={() => togglePreference('notificationsEnabled')}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            {/* Email Alerts Toggle */}
            <div className="preference-item">
              <div className="preference-info">
                <h3 className="preference-title">Email Alerts</h3>
                <p className="preference-description">
                  Get incident summaries delivered to your inbox
                </p>
              </div>
              <button 
                className={`toggle-switch ${preferences.emailAlerts ? 'active' : ''}`}
                onClick={() => togglePreference('emailAlerts')}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            {/* Sound Alerts Toggle */}
            <div className="preference-item">
              <div className="preference-info">
                <h3 className="preference-title">Sound Alerts</h3>
                <p className="preference-description">
                  Play audio notification for high-priority incidents
                </p>
              </div>
              <button 
                className={`toggle-switch ${preferences.soundAlerts ? 'active' : ''}`}
                onClick={() => togglePreference('soundAlerts')}
              >
                <span className="toggle-slider"></span>
              </button>
            </div>

            {/* Alert Severity Threshold */}
            <div className="preference-item severity-selector">
              <div className="preference-info">
                <h3 className="preference-title">Alert Severity Threshold</h3>
                <p className="preference-description">
                  Minimum confidence level for notifications
                </p>
              </div>
              <div className="severity-options">
                <button 
                  className={`severity-btn ${preferences.alertSeverity === 'low' ? 'active' : ''}`}
                  onClick={() => setPreferences(prev => ({...prev, alertSeverity: 'low'}))}
                >
                  Low (&gt;60%)
                </button>
                <button 
                  className={`severity-btn ${preferences.alertSeverity === 'medium' ? 'active' : ''}`}
                  onClick={() => setPreferences(prev => ({...prev, alertSeverity: 'medium'}))}
                >
                  Medium (&gt;70%)
                </button>
                <button 
                  className={`severity-btn ${preferences.alertSeverity === 'high' ? 'active' : ''}`}
                  onClick={() => setPreferences(prev => ({...prev, alertSeverity: 'high'}))}
                >
                  High (&gt;80%)
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Profile
