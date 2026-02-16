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
      await loadFriends();
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
          <span className="text-sm text-gray-400 italic">You</span>
        );
      case 'friends':
        return (
          <button
            onClick={() => handleViewCalendar(friend.id)}
            className="px-4 py-2 bg-[#40BCF4] text-white rounded-lg hover:bg-[#35a5d9] transition font-semibold"
          >
            View Calendar
          </button>
        );
      case 'pending_sent':
        return (
          <button
            onClick={() => handleCancelRequest(friend.id)}
            className="px-4 py-2 bg-[#2d3142] text-gray-300 rounded-lg hover:bg-[#363b4d] transition font-semibold border border-gray-700"
          >
            Cancel Request
          </button>
        );
      case 'pending_received':
        return (
          <span className="text-sm text-gray-400">
            (Sent you a request)
          </span>
        );
      default:
        return (
          <button
            onClick={() => handleSendRequest(friend.id)}
            className="px-4 py-2 bg-[#40BCF4] text-white rounded-lg hover:bg-[#35a5d9] transition font-semibold"
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
    <div className="min-h-screen bg-[#1a1d29]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-[#40BCF4] hover:text-[#35a5d9] mb-4 inline-block"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4 bg-[#252836] rounded-lg shadow-lg p-6 border border-gray-700">
            <ProfilePicture
              src={user.profilePictureUrl}
              alt={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              size="lg"
            />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}'s Friends`
                  : `${user.email}'s Friends`}
              </h1>
              <p className="text-gray-400 mt-1">{friendsCount} friends</p>
            </div>
          </div>
        </div>

        {/* Friends List */}
        {friends.length === 0 ? (
          <div className="text-center py-12 bg-[#252836] rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400">No friends yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map(friend => (
              <div key={friend.id} className="flex items-center justify-between p-4 bg-[#252836] rounded-lg border border-gray-700 hover:border-[#40BCF4] transition">
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
                    <p className="font-semibold text-white">
                      {friend.firstName && friend.lastName
                        ? `${friend.firstName} ${friend.lastName}`
                        : friend.email}
                    </p>
                    <p className="text-sm text-gray-400">{friend.email}</p>
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