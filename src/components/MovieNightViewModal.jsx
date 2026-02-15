import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { format12Hour } from '../utils/timeFormat';
import publicCalendarService from '../services/publicCalendarService';
import ProfilePicture from './ProfilePicture';
import toast from 'react-hot-toast';

function MovieNightViewModal({ isOpen, onClose, movieNightId, isOwner }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [attending, setAttending] = useState(false);

  useEffect(() => {
    if (isOpen && movieNightId) {
      loadDetails();
    }
  }, [isOpen, movieNightId]);

  const loadDetails = async () => {
    try {
      const data = await publicCalendarService.getMovieNightDetails(movieNightId);
      setDetails(data);
      setAttending(data.isAttending);
      setLoading(false);
    } catch (error) {
      console.error('Error loading movie night details:', error);
      toast.error('Failed to load movie night details');
      onClose();
    }
  };

  const handleAttendToggle = async () => {
    try {
      if (attending) {
        await publicCalendarService.unattendMovieNight(movieNightId);
        toast.success('RSVP removed');
        setAttending(false);
      } else {
        await publicCalendarService.attendMovieNight(movieNightId);
        toast.success('Successfully RSVP\'d! 🎬');
        setAttending(true);
      }
      // Reload to get updated attendee list
      await loadDetails();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update RSVP');
    }
  };

  if (!isOpen) return null;
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 bg-black bg-opacity-50"></div>
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!details) return null;

  const { movieNight, attendees, isOwner: isMovieOwner } = details;
  const formattedDate = movieNight.scheduledDate 
    ? format(new Date(movieNight.scheduledDate), 'EEEE, MMMM d, yyyy')
    : '';
  const formattedTime = format12Hour(movieNight.startTime);

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
                      <p className="text-lg text-gray-900">{formattedTime}</p>
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

                  {/* Attendees */}
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-600 mb-3">
                      Attendees ({attendees.length})
                    </label>
                    {attendees.length === 0 ? (
                      <p className="text-gray-500 text-sm">No one has RSVP'd yet</p>
                    ) : (
                      <div className="space-y-2">
                        {attendees.map(attendee => (
                          <div key={attendee.userId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                            <ProfilePicture
                              src={attendee.profilePictureUrl}
                              alt={attendee.firstName && attendee.lastName 
                                ? `${attendee.firstName} ${attendee.lastName}` 
                                : attendee.email}
                              size="sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {attendee.firstName && attendee.lastName
                                  ? `${attendee.firstName} ${attendee.lastName}`
                                  : attendee.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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

          {/* Footer Buttons */}
          <div className="bg-white border-t px-6 py-4 flex gap-3">
            {!isMovieOwner && (
              <button
                onClick={handleAttendToggle}
                className={`flex-1 py-2 px-6 rounded-lg transition font-semibold ${
                  attending
                    ? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {attending ? 'Remove RSVP' : 'RSVP - I\'m Attending!'}
              </button>
            )}
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