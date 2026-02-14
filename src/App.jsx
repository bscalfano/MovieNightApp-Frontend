import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import AddMovieNightPage from './pages/AddMovieNightPage';
import EditMovieNightPage from './pages/EditMovieNightPage';
import PastMoviesPage from './pages/PastMoviesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddMovieNightPage />} />
        <Route path="/edit/:id" element={<EditMovieNightPage />} />
        <Route path="/past" element={<PastMoviesPage />} />
      </Routes>
    </Router>
  );
}

export default App;