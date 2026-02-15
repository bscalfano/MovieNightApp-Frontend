import { format } from 'date-fns';

function MovieNightViewModal({ isOpen, onClose, movieNight }) {
  if (!isOpen || !movieNight) return null;

  const formattedDate = movieNight.scheduledDate 
    ? format(new Date(movieNight.scheduledDate), 'EEEE, MMMM d, yyyy')
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Movie Night Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Content - Two Column Layout */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex">
              {/* Left Column - Details */}
              <div className="flex-1 p-6 border-r">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Movie Title
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{movieNight.movieTitle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Date
                      </label>
                      <p className="text-lg text-gray-900">{formattedDate}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Start Time
                      </label>
                      <p className="text-lg text-gray-900">{movieNight.startTime}</p>
                    </div>
                  </div>

                  {movieNight.genre && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Genre
                      </label>
                      <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                        {movieNight.genre}
                      </span>
                    </div>
                  )}

                  {movieNight.notes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Notes
                      </label>
                      <p className="text-gray-900 whitespace-pre-wrap">{movieNight.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Poster Area */}
              <div className="w-80 p-6 bg-gray-50 flex flex-col">
                <label className="block text-gray-700 font-semibold mb-3">
                  Movie Poster
                </label>
                <div className="flex-1 flex items-start justify-center">
                  {movieNight.imageUrl ? (
                    <img 
                      src={movieNight.imageUrl} 
                      alt="Movie Poster" 
                      className="max-w-full h-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const placeholder = document.createElement('div');
                        placeholder.className = 'w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300';
                        placeholder.innerHTML = `
                          <div class="text-center p-4">
                            <svg class="mx-auto h-12 w-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p class="text-sm">No poster</p>
                          </div>
                        `;
                        e.target.parentElement.appendChild(placeholder);
                      }}
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
                      <div className="text-center p-4">
                        <svg 
                          className="mx-auto h-12 w-12 text-gray-300 mb-2" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                        <p className="text-sm">No poster</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="bg-white border-t px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieNightViewModal;