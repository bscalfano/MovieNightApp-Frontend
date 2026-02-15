import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import followService from '../services/followService';
import ProfilePicture from '../components/ProfilePicture';
import LoadingSpinner from '../components/LoadingSpinner';

function FindFriendsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'followers', 'following'

  useEffect(() => {
    loadFollowData();
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

  const loadFollowData = async () => {
    try {
      const [followersData, followingData] = await Promise.all([
        followService.getFollowers(),
        followService.getFollowing()
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading follow data:', error);
      toast.error('Failed to load follow data');
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    setSearching(true);
    try {
      const results = await followService.searchUsers(searchQuery);
      setSearchResults(results);
      setSearching(false);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      setSearching(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await followService.followUser(userId);
      toast.success('Followed user!');
      
      // Update local state
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing: true } : user
      ));
      setFollowers(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing: true } : user
      ));
      
      // Reload following list
      const followingData = await followService.getFollowing();
      setFollowing(followingData);
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      await followService.unfollowUser(userId);
      toast.success('Unfollowed user');
      
      // Update local state
      setSearchResults(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing: false } : user
      ));
      setFollowers(prev => prev.map(user => 
        user.id === userId ? { ...user, isFollowing: false } : user
      ));
      setFollowing(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
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
            {user.isFollowing ? (
              <button
                onClick={() => handleUnfollow(user.id)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Following
              </button>
            ) : (
              <button
                onClick={() => handleFollow(user.id)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Follow
              </button>
            )}
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
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
            ← Back to Calendar
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Find Friends</h1>
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
            onClick={() => setActiveTab('followers')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'followers'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Followers ({followers.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'following'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Following ({following.length})
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

        {activeTab === 'followers' && renderUserList(followers)}
        {activeTab === 'following' && renderUserList(following)}
      </div>
    </div>
  );
}

export default FindFriendsPage;