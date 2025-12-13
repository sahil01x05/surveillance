/**
 * Incidents Page Component
 * 
 * Core page that displays all incidents in real-time.
 * Fetches existing incidents from the backend and subscribes to WebSocket
 * for live updates. New incidents appear instantly without page refresh.
 */

import { useState, useEffect, useRef } from 'react'
import IncidentCard from '../components/IncidentCard'
import './Incidents.css'

function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)
  const [newIncidentIds, setNewIncidentIds] = useState(new Set())
  const wsRef = useRef(null)

  // Fetch initial incidents on component mount
  useEffect(() => {
    fetchIncidents()
  }, [])

  // Set up WebSocket connection for real-time updates
  useEffect(() => {
    connectWebSocket()
    
    // Cleanup: close WebSocket when component unmounts
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  const fetchIncidents = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/incidents')
      if (response.ok) {
        const data = await response.json()
        // Sort by timestamp (newest first)
        const sorted = data.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        )
        setIncidents(sorted)
      } else {
        console.error('Failed to fetch incidents:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const connectWebSocket = () => {
    try {
      // Determine WebSocket protocol (ws or wss)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const ws = new WebSocket(`${protocol}//localhost:8000/ws`)
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected')
        setWsConnected(true)
      }

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        
        if (message.type === 'bootstrap') {
          // Initial backlog of incidents from server
          console.log('📦 Received bootstrap data:', message.items.length, 'incidents')
          const sorted = message.items.sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
          )
          setIncidents(sorted)
        } else if (message.type === 'incident') {
          // New incident received - add to top of list
          console.log('🚨 New incident received:', message.data.label)
          setIncidents(prev => [message.data, ...prev])
          
          // Mark as new for animation
          setNewIncidentIds(prev => new Set(prev).add(message.data.id))
          
          // Remove "new" status after 5 seconds
          setTimeout(() => {
            setNewIncidentIds(prev => {
              const updated = new Set(prev)
              updated.delete(message.data.id)
              return updated
            })
          }, 5000)
        }
      }

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setWsConnected(false)
      }

      ws.onclose = () => {
        console.log('🔌 WebSocket disconnected')
        setWsConnected(false)
        
        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          console.log('🔄 Attempting to reconnect...')
          connectWebSocket()
        }, 5000)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
    }
  }

  // Calculate statistics
  const totalIncidents = incidents.length
  const criticalIncidents = incidents.filter(i => i.confidence > 0.8).length
  const activeIncidents = incidents.filter(i => {
    const diffMs = new Date() - new Date(i.timestamp)
    const diffMins = diffMs / 60000
    return diffMins < 15 // Active if within last 15 minutes
  }).length

  return (
    <div className="incidents-page">
      {/* Page Header */}
      <div className="incidents-header">
        <div className="header-top">
          <h1 className="page-title">🚨 Live Incidents</h1>
          <div className={`connection-status ${wsConnected ? 'connected' : 'disconnected'}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {wsConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-box">
            <span className="stat-label">Total Incidents</span>
            <span className="stat-value">{totalIncidents}</span>
          </div>
          <div className="stat-box stat-active">
            <span className="stat-label">Active (15min)</span>
            <span className="stat-value">{activeIncidents}</span>
          </div>
          <div className="stat-box stat-critical">
            <span className="stat-label">High Risk (&gt;80%)</span>
            <span className="stat-value">{criticalIncidents}</span>
          </div>
        </div>
      </div>

      {/* Incidents List */}
      <div className="incidents-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading incidents...</p>
          </div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h2>No Incidents Detected</h2>
            <p>All systems are operating normally. No security threats detected.</p>
          </div>
        ) : (
          <div className="incidents-grid">
            {incidents.map((incident) => (
              <IncidentCard 
                key={incident.id} 
                incident={incident}
                isNew={newIncidentIds.has(incident.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Incidents
