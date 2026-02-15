import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import friendsService from '../services/friendsService';
import ProfilePicture from '../components/ProfilePicture';
import LoadingSpinner from '../components/LoadingSpinner';

function FindFriendsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.defaultTab || 'search');

  // Determine back link based on where user came from
  const backLink = location.state?.from || '/';
  const backText = location.state?.from === '/profile' ? '← Back to Profile' : '← Back to Calendar';

  useEffect(() => {
    loadFriendData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        searchUsers();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const loadFriendData = async () => {
    try {
      const [friendsData, requestsData] = await Promise.all([
        friendsService.getFriends(),
        friendsService.getPendingRequests()
      ]);
      setFriends(friendsData);
      setPendingRequests(requestsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading friend data:', error);
      toast.error('Failed to load friend data');
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    setSearching(true);
    try {
      const results = await friendsService.searchUsers(searchQuery);
      setSearchResults(results);
      setSearching(false);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setSearching(false);
    }
  };

  const handleSendRequest = async (userId) => {
    try {
      await friendsService.sendFriendRequest(userId);
      toast.success('Friend request sent!');
      
      // Update local state
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, friendshipStatus: 'pending_sent' } : user
      ));
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data || 'Failed to send friend request');
    }
  };

  const handleCancelRequest = async (userId) => {
    try {
      await friendsService.cancelFriendRequest(userId);
      toast.success('Friend request cancelled');
      
      // Update local state
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, friendshipStatus: 'none' } : user
      ));
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      toast.error('Failed to cancel friend request');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      await friendsService.acceptFriendRequest(requestId);
      toast.success('Friend request accepted!');
      await loadFriendData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await friendsService.rejectFriendRequest(requestId);
      toast.success('Friend request rejected');
      await loadFriendData();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request');
    }
  };

  const handleRemoveFriend = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) {
      return;
    }

    try {
      await friendsService.removeFriend(userId);
      toast.success('Friend removed');
      await loadFriendData();
      
      // Update search results if present
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, friendshipStatus: 'none' } : user
      ));
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  const renderActionButton = (user) => {
    switch (user.friendshipStatus) {
      case 'friends':
        return (
          <button
            onClick={() => handleRemoveFriend(user.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
          >
            Remove Friend
          </button>
        );
      case 'pending_sent':
        return (
          <button
            onClick={() => handleCancelRequest(user.id)}
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
            onClick={() => handleSendRequest(user.id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            Add Friend
          </button>
        );
    }
  };

  const renderUserList = (users) => {
    if (users.length === 0) {
      return (
        <div className="text-center py-12 text-gray-600">
          No users found
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <ProfilePicture
                src={user.profilePictureUrl}
                alt={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                size="md"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.email}
                </p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            {renderActionButton(user)}
          </div>
        ))}
      </div>
    );
  };

  const renderPendingRequests = () => {
    if (pendingRequests.length === 0) {
      return (
        <div className="text-center py-12 text-gray-600">
          No pending friend requests
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {pendingRequests.map(request => (
          <div key={request.id} className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition">
            <div className="flex items-center gap-3">
              <ProfilePicture
                src={request.senderProfilePictureUrl}
                alt={request.senderFirstName && request.senderLastName 
                  ? `${request.senderFirstName} ${request.senderLastName}` 
                  : request.senderEmail}
                size="md"
              />
              <div>
                <p className="font-semibold text-gray-900">
                  {request.senderFirstName && request.senderLastName
                    ? `${request.senderFirstName} ${request.senderLastName}`
                    : request.senderEmail}
                </p>
                <p className="text-sm text-gray-600">{request.senderEmail}</p>
                <p className="text-xs text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAcceptRequest(request.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                Accept
              </button>
              <button
                onClick={() => handleRejectRequest(request.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(backLink)}
            className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block"
          >
            {backText}
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Friends</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'search'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'friends'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 font-semibold transition relative ${
              activeTab === 'requests'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Requests ({pendingRequests.length})
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'search' && (
          <div>
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searching && (
                <p className="text-sm text-gray-600 mt-2">Searching...</p>
              )}
            </div>

            {/* Search Results */}
            {searchQuery.length < 2 ? (
              <div className="text-center py-12 text-gray-600">
                Type at least 2 characters to search for users
              </div>
            ) : (
              renderUserList(searchResults)
            )}
          </div>
        )}

        {activeTab === 'friends' && renderUserList(friends)}
        {activeTab === 'requests' && renderPendingRequests()}
      </div>
    </div>
  );
}

export default FindFriendsPage;