import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(false)
  const [wsConnected, setWsConnected] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    critical: 0,
  })

  // Fetch initial incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      setLoading(true)
      try {
        const res = await fetch('http://localhost:8000/incidents')
        const data = await res.json()
        setIncidents(data)
        setStats({
          total: data.length,
          today: data.filter(i => isToday(new Date(i.timestamp))).length,
          critical: data.filter(i => i.confidence > 0.8).length,
        })
      } catch (err) {
        console.error('Failed to fetch incidents:', err)
      }
      setLoading(false)
    }
    fetchIncidents()
  }, [])

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//localhost:8000/ws`)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setWsConnected(true)
    }

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'bootstrap') {
        // Initial data from server
        setIncidents(msg.items.reverse())
      } else if (msg.type === 'incident') {
        // New incident arrived
        setIncidents(prev => [msg.data, ...prev])
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          today: prev.today + 1,
          critical: prev.critical + (msg.data.confidence > 0.8 ? 1 : 0),
        }))
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      setWsConnected(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      setWsConnected(false)
    }

    return () => ws.close()
  }, [])

  function isToday(date) {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  function formatTime(ts) {
    return new Date(ts).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  function getIncidentClass(confidence) {
    if (confidence > 0.8) return 'critical'
    if (confidence > 0.6) return 'warning'
    return 'normal'
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <h1>🎥 Smart Surveillance Dashboard</h1>
          <div className="status-indicator">
            <span className={wsConnected ? 'ws-connected' : 'ws-disconnected'}>
              {wsConnected ? '🟢 Live' : '🔴 Offline'}
            </span>
          </div>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3 className="stat-label">Total Incidents</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3 className="stat-label">Today</h3>
          <p className="stat-value">{stats.today}</p>
        </div>
        <div className="stat-card critical">
          <h3 className="stat-label">Critical</h3>
          <p className="stat-value">{stats.critical}</p>
        </div>
      </section>

      <section className="incidents-section">
        <h2>Recent Incidents</h2>
        {loading ? (
          <p className="loading-text">Loading incidents...</p>
        ) : incidents.length === 0 ? (
          <div className="no-incidents">
            <p>✅ No incidents detected</p>
            <p className="text-muted">All systems normal</p>
          </div>
        ) : (
          <div className="incidents-list">
            {incidents.map((incident) => (
              <div key={incident.id} className={`incident-card ${getIncidentClass(incident.confidence)}`}>
                <div className="incident-header">
                  <h3 className="incident-label">⚠️ {incident.label.toUpperCase()}</h3>
                  <span className={`confidence confidence-${Math.round(incident.confidence * 100)}`}>
                    {(incident.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
                <p className="incident-summary">{incident.summary}</p>
                <div className="incident-meta">
                  <span className="meta-item">📍 {incident.location || 'Unknown'}</span>
                  <span className="meta-item">🎥 {incident.camera_id}</span>
                  <span className="meta-item">⏰ {formatTime(incident.timestamp)}</span>
                </div>
                {incident.frame && (
                  <details className="frame-details">
                    <summary>View Frame</summary>
                    <img src={`data:image/jpeg;base64,${incident.frame}`} alt="Incident frame" className="incident-frame" />
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default App
