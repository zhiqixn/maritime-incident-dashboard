import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './IncidentCards.css';

const IncidentCards = () => {
  const [incidents, setIncidents] = useState([]);
  const [timeGranularity, setTimeGranularity] = useState('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:53120/api/incidents?granularity=${timeGranularity}`);
        setIncidents(response.data);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, [timeGranularity]);

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': '#95E1D3',
      'Medium': '#FCE38A',
      'High': '#F38181',
      'Critical': '#FF0000'
    };
    return colors[severity] || '#95E1D3';
  };

  return (
    <div className="incidents-container">
      <div className="incidents-header">
        <h2>Incident Reports</h2>
        <select
          value={timeGranularity}
          onChange={(e) => setTimeGranularity(e.target.value)}
          className="granularity-select"
        >
          <option value="hour">By Hour</option>
          <option value="day">By Day</option>
          <option value="month">By Month</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading incidents...</div>
      ) : (
        <div className="incident-cards">
          {incidents.map((incident, index) => (
            <div 
              key={index} 
              className="incident-card"
              style={{ borderLeft: `4px solid ${getSeverityColor(incident.severity)}` }}
            >
              <div className="card-header">
                <span className="incident-type">{incident.incident_type}</span>
                <span className="incident-date">{incident.time}</span>
              </div>
              <div className="vessel-info">
                <strong>Vessel:</strong> {incident.vessel_type}
              </div>
              <div className="severity-info">
                <strong>Severity:</strong>
                <span 
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(incident.severity) }}
                >
                  {incident.severity}
                </span>
              </div>
              <div className="incident-location">
                <strong>Location:</strong> {incident.location}
              </div>
              {incident.description && (
                <div className="incident-description">
                  {incident.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentCards;