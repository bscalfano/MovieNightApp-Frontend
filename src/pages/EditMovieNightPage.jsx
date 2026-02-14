import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import MovieNightForm from '../components/MovieNightForm';
import LoadingSpinner from '../components/LoadingSpinner';

function EditMovieNightPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movieNight, setMovieNight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMovieNight();
  }, [id]);

  const loadMovieNight = async () => {
    try {
      const data = await movieNightService.getById(id);
      setMovieNight(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      toast.error('Failed to load movie night');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await movieNightService.update(id, formData);
      toast.success('Movie night updated successfully! ✨');
      navigate('/');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update movie night');
    }
  };

  if (loading) return <LoadingSpinner message="Loading movie details..." />;
  if (error) return <div className="text-red-600 text-center py-8">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Movie Night</h1>
        <MovieNightForm onSubmit={handleSubmit} initialData={movieNight} />
      </div>
    </div>
  );
}

export default EditMovieNightPage;