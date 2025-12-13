/**
 * IncidentCard Component
 * 
 * Displays a single incident with type, confidence, location, timestamp, and status.
 * High-confidence incidents (>80%) are highlighted with a red border.
 */

import { useState } from 'react'
import './IncidentCard.css'

function IncidentCard({ incident, isNew = false }) {
  const [showFrame, setShowFrame] = useState(false)

  // Format timestamp to human-readable format
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Determine severity class based on confidence
  const getSeverityClass = () => {
    if (incident.confidence > 0.8) return 'high-risk'
    if (incident.confidence > 0.6) return 'medium-risk'
    return 'low-risk'
  }

  // Get status badge text
  const getStatusText = () => {
    if (isNew) return 'NEW'
    if (incident.confidence > 0.8) return 'ACTIVE'
    return 'LOGGED'
  }

  return (
    <div className={`incident-card ${getSeverityClass()}`}>
      {/* Status Badge */}
      <div className={`status-badge ${isNew ? 'badge-new' : 'badge-active'}`}>
        {getStatusText()}
      </div>

      {/* Card Header */}
      <div className="incident-header">
        <h3 className="incident-type">
          ⚠️ {incident.label || 'Possible Violence'}
        </h3>
        <span className="confidence-badge">
          {Math.round(incident.confidence * 100)}%
        </span>
      </div>

      {/* Card Body */}
      <div className="incident-body">
        <p className="incident-description">
          {incident.summary || 'Potential security incident detected'}
        </p>

        {/* Metadata */}
        <div className="incident-metadata">
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span className="meta-text">{incident.location || 'Unknown Location'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🎥</span>
            <span className="meta-text">{incident.camera_id || 'camera-1'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">⏰</span>
            <span className="meta-text">{formatTime(incident.timestamp)}</span>
          </div>
        </div>

        {/* Frame Preview (if available) */}
        {incident.frame && (
          <div className="frame-preview-section">
            <button 
              className="toggle-frame-btn"
              onClick={() => setShowFrame(!showFrame)}
            >
              {showFrame ? '▼ Hide Frame' : '▶ View Captured Frame'}
            </button>
            {showFrame && (
              <div className="frame-preview">
                <img 
                  src={`data:image/jpeg;base64,${incident.frame}`} 
                  alt="Incident capture" 
                  className="incident-image"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default IncidentCard
