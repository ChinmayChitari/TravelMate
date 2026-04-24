import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Camera from './pages/Camera';
import TripPlanner from './pages/TripPlanner';
import MapView from './pages/Map';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/camera" element={<Camera />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </main>
        <Toaster position="bottom-center" />
      </div>
    </Router>
  );
}

export default App;
