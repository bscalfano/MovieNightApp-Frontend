function ProfilePicture({ src, alt, size = 'md', onClick }) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-32 h-32 text-4xl'
  };

  const getInitials = () => {
    if (!alt) return '?';
    const names = alt.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return alt.substring(0, 2).toUpperCase();
  };

  return (
    <div
      onClick={onClick}
      className={`${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-indigo-600 text-white font-semibold ${
        onClick ? 'cursor-pointer hover:bg-indigo-700 transition' : ''
      }`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = getInitials();
          }}
        />
      ) : (
        <span>{getInitials()}</span>
      )}
    </div>
  );
}

export default ProfilePicture;