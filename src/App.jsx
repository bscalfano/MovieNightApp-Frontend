import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import PastMoviesPage from './pages/PastMoviesPage';
import ProfilePage from './pages/ProfilePage';
import FindFriendsPage from './pages/FindFriendsPage';
import PublicCalendarPage from './pages/PublicCalendarPage';
import UserFriendsPage from './pages/UserFriendsPage';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import './App.css';

function App() {
  const isAuthenticated = authService.getCurrentUser() !== null;

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/calendar" replace /> : <LandingPage />} 
        />

        {/* Protected Routes */}
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/past"
          element={
            <ProtectedRoute>
              <PastMoviesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute>
              <FindFriendsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar/:userId"
          element={
            <ProtectedRoute>
              <PublicCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:userId/friends"
          element={
            <ProtectedRoute>
              <UserFriendsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;