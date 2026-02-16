import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import profileService from '../services/profileService';
import authService from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import ProfilePicture from '../components/ProfilePicture';

function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const [profileForm, setProfileForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    profilePictureUrl: '',
    letterboxdUsername: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
      setProfileForm({
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        profilePictureUrl: data.profilePictureUrl || '',
        letterboxdUsername: data.letterboxdUsername || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileService.updateProfile(
        profileForm.email,
        profileForm.firstName,
        profileForm.lastName,
        profileForm.profilePictureUrl,
        profileForm.letterboxdUsername
      );
      toast.success('Profile updated successfully!');
      
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        currentUser.email = profileForm.email;
        currentUser.firstName = profileForm.firstName;
        currentUser.lastName = profileForm.lastName;
        currentUser.profilePictureUrl = profileForm.profilePictureUrl;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      await loadProfile();
      setEditMode(false);
      setSaving(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      await profileService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      toast.success('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordMode(false);
      setSaving(false);
    } catch (error) {
      console.error('Error changing password:', error);
      const errorMsg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(', ')
        : 'Failed to change password';
      toast.error(errorMsg);
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await profileService.deleteAccount();
      toast.success('Account deleted successfully');
      authService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-[#1a1d29]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link to="/calendar" className="text-[#40BCF4] hover:text-[#35a5d9] mb-2 inline-block">
              ← Back to Calendar
            </Link>
            <h1 className="text-4xl font-bold text-white">Profile Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#252836] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center mb-6">
              <ProfilePicture
                src={profile.profilePictureUrl}
                alt={profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.email}
                size="lg"
              />
              <h3 className="text-lg font-semibold text-white mt-4">
                {profile.firstName && profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`
                  : profile.email}
              </h3>
            </div>
            <h4 className="text-md font-semibold text-gray-300 mb-4 border-t border-gray-700 pt-4">Statistics</h4>
            <div className="space-y-3">
              <Link to="/calendar" className="block p-3 rounded-lg hover:bg-[#2d3142] transition cursor-pointer">
                <p className="text-sm text-gray-400">Total Movie Nights</p>
                <p className="text-3xl font-bold text-[#40BCF4]">{profile.totalMovieNights}</p>
              </Link>
              <Link to="/calendar" className="block p-3 rounded-lg hover:bg-[#2d3142] transition cursor-pointer">
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-3xl font-bold text-green-500">{profile.upcomingMovieNights}</p>
              </Link>
              <Link to="/friends" state={{ defaultTab: 'friends', from: '/profile' }} className="block p-3 rounded-lg hover:bg-[#2d3142] transition cursor-pointer">
                <p className="text-sm text-gray-400">Friends</p>
                <p className="text-3xl font-bold text-blue-500">{profile.friendsCount}</p>
              </Link>
              <Link to="/friends" state={{ defaultTab: 'requests', from: '/profile' }} className="block p-3 rounded-lg hover:bg-[#2d3142] transition cursor-pointer">
                <p className="text-sm text-gray-400">Pending Requests</p>
                <p className="text-3xl font-bold text-orange-500">{profile.pendingRequestsCount}</p>
              </Link>
              <div className="p-3">
                <p className="text-sm text-gray-400">Member Since</p>
                <p className="text-sm font-semibold text-white">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Link to="/friends" state={{ from: '/profile' }} className="text-[#40BCF4] hover:text-[#35a5d9] font-semibold">
                Find Friends →
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 bg-[#252836] rounded-lg shadow-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Profile Information</h3>
              {!editMode && !passwordMode && (
                <button onClick={() => setEditMode(true)} className="text-[#40BCF4] hover:text-[#35a5d9] font-semibold">
                  Edit Profile
                </button>
              )}
            </div>

            {editMode && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    required
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Profile Picture URL</label>
                  <input
                    type="url"
                    name="profilePictureUrl"
                    value={profileForm.profilePictureUrl}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  {profileForm.profilePictureUrl && (
                    <div className="mt-2">
                      <ProfilePicture src={profileForm.profilePictureUrl} alt="Preview" size="lg" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Letterboxd Username</label>
                  <input
                    type="text"
                    name="letterboxdUsername"
                    value={profileForm.letterboxdUsername}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                    placeholder="username"
                  />
                  {profileForm.letterboxdUsername && (
                    <p className="text-sm text-gray-400 mt-1">
                      Profile: <a href={`https://letterboxd.com/${profileForm.letterboxdUsername}`} target="_blank" rel="noopener noreferrer" className="text-[#40BCF4] hover:underline">
                        letterboxd.com/{profileForm.letterboxdUsername}
                      </a>
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="flex-1 bg-[#40BCF4] text-white py-2 px-4 rounded-lg hover:bg-[#35a5d9] transition font-semibold disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditMode(false);
                      setProfileForm({
                        email: profile.email,
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        profilePictureUrl: profile.profilePictureUrl || '',
                        letterboxdUsername: profile.letterboxdUsername || ''
                      });
                    }}
                    disabled={saving}
                    className="flex-1 bg-[#363b4d] text-gray-300 py-2 px-4 rounded-lg hover:bg-[#3d4252] transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {passwordMode && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="flex-1 bg-[#40BCF4] text-white py-2 px-4 rounded-lg hover:bg-[#35a5d9] transition font-semibold disabled:opacity-50">
                    {saving ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordMode(false);
                      setPasswordForm({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    disabled={saving}
                    className="flex-1 bg-[#363b4d] text-gray-300 py-2 px-4 rounded-lg hover:bg-[#3d4252] transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!editMode && !passwordMode && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-lg font-semibold text-white">
                    {profile.firstName && profile.lastName
                      ? `${profile.firstName} ${profile.lastName}`
                      : profile.firstName || profile.lastName || 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg font-semibold text-white">{profile.email}</p>
                </div>
                {profile.letterboxdUsername && (
                  <div>
                    <p className="text-sm text-gray-400">Letterboxd</p>
                    <a href={`https://letterboxd.com/${profile.letterboxdUsername}`} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[#40BCF4] hover:text-[#35a5d9] hover:underline">
                      @{profile.letterboxdUsername}
                    </a>
                  </div>
                )}
                <div className="pt-4 border-t border-gray-700">
                  <button onClick={() => setPasswordMode(true)} className="text-[#40BCF4] hover:text-[#35a5d9] font-semibold">
                    Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-[#252836] rounded-lg shadow-lg p-6 border-2 border-red-900">
          <h3 className="text-lg font-semibold text-red-500 mb-4">Danger Zone</h3>
          <p className="text-sm text-gray-400 mb-4">
            Once you delete your account, there is no going back. All your movie nights will be permanently deleted.
          </p>
          <button onClick={() => setDeleteDialog(true)} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold">
            Delete Account
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone and all your movie nights will be permanently deleted."
      />
    </div>
  );
}

export default ProfilePage;