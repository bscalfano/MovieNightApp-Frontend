import { format } from 'date-fns';

function MovieNightCard({ movieNight, onDelete, onEdit }) {
  const formattedDate = format(new Date(movieNight.scheduledDate), 'EEEE, MMMM d, yyyy');
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {movieNight.imageUrl && (
        <img
          src={movieNight.imageUrl}
          alt={movieNight.movieTitle}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{movieNight.movieTitle}</h3>
        {movieNight.genre && (
          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded mb-2">
            {movieNight.genre}
          </span>
        )}
        <p className="text-gray-600 mb-1">📅 {formattedDate}</p>
        <p className="text-gray-600 mb-3">🕐 {movieNight.startTime}</p>
        {movieNight.notes && (
          <p className="text-gray-700 text-sm mb-4 italic line-clamp-3">"{movieNight.notes}"</p>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(movieNight.id)}
            className="flex-1 text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(movieNight.id, movieNight.movieTitle)}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieNightCard;