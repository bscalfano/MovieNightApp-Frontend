import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import PastMoviesPage from './pages/PastMoviesPage';
import ProfilePage from './pages/ProfilePage';
import FindFriendsPage from './pages/FindFriendsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicCalendarPage from './pages/PublicCalendarPage';
import UserFriendsPage from './pages/UserFriendsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
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