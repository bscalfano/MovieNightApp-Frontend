import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import friendsService from '../services/friendsService';
import ProfilePicture from '../components/ProfilePicture';
import LoadingSpinner from '../components/LoadingSpinner';

function UserFriendsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    try {
      const response = await friendsService.getUserFriends(userId);
      setData(response);
      setLoading(false);
    } catch (error) {
      console.error('Error loading friends:', error);
      if (error.response?.status === 403) {
        toast.error('You must be friends to view their friends list');
      } else {
        toast.error('Failed to load friends');
      }
      navigate(-1);
    }
  };

  const handleSendRequest = async (friendUserId) => {
    try {
      await friendsService.sendFriendRequest(friendUserId);
      toast.success('Friend request sent!');
      await loadFriends(); // Reload to update status
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data || 'Failed to send friend request');
    }
  };

  const handleCancelRequest = async (friendUserId) => {
    try {
      await friendsService.cancelFriendRequest(friendUserId);
      toast.success('Friend request cancelled');
      await loadFriends();
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      toast.error('Failed to cancel friend request');
    }
  };

  const handleViewCalendar = (friendUserId) => {
    navigate(`/calendar/${friendUserId}`);
  };

  const renderActionButton = (friend) => {
    switch (friend.friendshipStatus) {
      case 'self':
        return (
          <span className="text-sm text-gray-600 italic">You</span>
        );
      case 'friends':
        return (
          <button
            onClick={() => handleViewCalendar(friend.id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            View Calendar
          </button>
        );
      case 'pending_sent':
        return (
          <button
            onClick={() => handleCancelRequest(friend.id)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Cancel Request
          </button>
        );
      case 'pending_received':
        return (
          <span className="text-sm text-gray-600">
            (Sent you a request)
          </span>
        );
      default:
        return (
          <button
            onClick={() => handleSendRequest(friend.id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Add Friend
          </button>
        );
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading friends..." />;
  }

  if (!data) {
    return null;
  }

  const { user, friends, friendsCount } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4 bg-white rounded-lg shadow-md p-6">
            <ProfilePicture
              src={user.profilePictureUrl}
              alt={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              size="lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}'s Friends`
                  : `${user.email}'s Friends`}
              </h1>
              <p className="text-gray-600 mt-1">{friendsCount} friends</p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        {friends.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl text-gray-600">No friends yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition">
                <button
                  onClick={() => friend.friendshipStatus === 'friends' || friend.friendshipStatus === 'self' ? handleViewCalendar(friend.id) : null}
                  className="flex items-center gap-3 flex-1 text-left"
                  disabled={friend.friendshipStatus !== 'friends' && friend.friendshipStatus !== 'self'}
                >
                  <ProfilePicture
                    src={friend.profilePictureUrl}
                    alt={friend.firstName && friend.lastName ? `${friend.firstName} ${friend.lastName}` : friend.email}
                    size="md"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {friend.firstName && friend.lastName
                        ? `${friend.firstName} ${friend.lastName}`
                        : friend.email}
                    </p>
                    <p className="text-sm text-gray-600">{friend.email}</p>
                  </div>
                </button>
                {renderActionButton(friend)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserFriendsPage;