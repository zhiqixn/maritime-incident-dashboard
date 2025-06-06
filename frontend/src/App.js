import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import IncidentCards from './components/IncidentCards';
import ChatAssistant from './components/ChatAssistant';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="nav-bar">
          <h1>Maritime Incident Dashboard</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/incidents">Incident Reports</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/incidents" element={<IncidentCards />} />
        </Routes>
        
        <ChatAssistant />
      </div>
    </Router>
  );
}

export default App;