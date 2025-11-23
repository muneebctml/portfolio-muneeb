import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Games from './components/Games/Games';
import Dashboard from './components/Dashboard';
import portfolioData from './data/portfolio.json';

function App() {
  useEffect(() => {
    // Track visitor
    fetch('http://localhost:3001/api/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ip: '127.0.0.1', // In a real app, the server would extract this
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error('Tracking failed', err));
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home data={portfolioData} />} />
            <Route path="/games/*" element={<Games />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
