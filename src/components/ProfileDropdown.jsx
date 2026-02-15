import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';

function ProfileDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <ProfilePicture
        src={user?.profilePictureUrl}
        alt={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
        size="md"
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : 'User'}
            </p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <button
            onClick={handleProfileClick}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Profile
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;