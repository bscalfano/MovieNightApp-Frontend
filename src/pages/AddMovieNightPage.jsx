import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import movieNightService from '../services/movieNightService';
import MovieNightForm from '../components/MovieNightForm';

function AddMovieNightPage() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      await movieNightService.create(formData);
      toast.success('Movie night created successfully! 🎬');
      navigate('/');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create movie night');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Add Movie Night</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <MovieNightForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default AddMovieNightPage;