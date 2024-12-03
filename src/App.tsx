import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import GPXViewer from './components/GPXViewer';
import MembersList from './components/MembersList';
import News from './components/News';
import Calendar from './components/Calendar';
import Events from './pages/Events';
import Support from './pages/Support';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/viewer" element={
        <ProtectedRoute>
          <GPXViewer />
        </ProtectedRoute>
      } />
      <Route path="/members" element={
        <ProtectedRoute>
          <MembersList />
        </ProtectedRoute>
      } />
      <Route path="/news" element={
        <ProtectedRoute>
          <News />
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      } />
      <Route path="/events" element={
        <ProtectedRoute>
          <Events />
        </ProtectedRoute>
      } />
      <Route path="/support" element={
        <ProtectedRoute>
          <Support />
        </ProtectedRoute>
      } />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}