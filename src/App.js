import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles/variables.css';

// Import pages 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import QuoteView from './pages/QuoteView';

function App() {
  return (
    <Router>
      <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quote/:id" element={<QuoteView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;