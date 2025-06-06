import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import './Dashboard.css';

// Color mappings for each category
const VESSEL_TYPE_COLORS = {
  'Cargo Ship': '#FF6B6B',
  'Tanker': '#4ECDC4',
  'Fishing Vessel': '#45B7D1',
  'Passenger Ship': '#96CEB4',
  'Container Ship': '#FFEEAD'
};

const INCIDENT_TYPE_COLORS = {
  'Collision': '#FF6B6B',
  'Grounding': '#4ECDC4',
  'Fire': '#FFD93D',
  'Equipment Failure': '#6C5B7B',
  'Weather Related': '#C06C84'
};

const SEVERITY_COLORS = {
  'Low': '#95E1D3',
  'Medium': '#FCE38A',
  'High': '#F38181',
  'Critical': '#FF0000'
};

function Dashboard() {
  const [stats, setStats] = useState({
    vesselTypeCounts: {},
    incidentTypeCounts: {},
    severityCounts: {}
  });
  const [timeline, setTimeline] = useState([]);
  const [timeGranularity, setTimeGranularity] = useState('day');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, timelineResponse] = await Promise.all([
          axios.get('http://localhost:53120/api/incidents/stats'),
          axios.get(`http://localhost:53120/api/incidents/timeline?granularity=${timeGranularity}`)
        ]);
        setStats(statsResponse.data);
        setTimeline(timelineResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [timeGranularity]);

  const formatData = (data) => {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="dashboard">
      <div className="charts-container">
        <div className="pie-charts">
          <div className="chart-wrapper">
            <h3>Incidents by Vessel Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatData(stats.vesselTypeCounts)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {
                    formatData(stats.vesselTypeCounts).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={VESSEL_TYPE_COLORS[entry.name]} />
                    ))
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <h3>Incidents by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatData(stats.incidentTypeCounts)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {
                    formatData(stats.incidentTypeCounts).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={INCIDENT_TYPE_COLORS[entry.name]} />
                    ))
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-wrapper">
            <h3>Incidents by Severity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={formatData(stats.severityCounts)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  label
                >
                  {
                    formatData(stats.severityCounts).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.name]} />
                    ))
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="timeline-chart">
          <div className="timeline-controls">
            <h3>Incident Timeline</h3>
            <select
              value={timeGranularity}
              onChange={(e) => setTimeGranularity(e.target.value)}
            >
              <option value="hour">By Hour</option>
              <option value="day">By Day</option>
              <option value="month">By Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="count" 
                fill="#4ECDC4"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;