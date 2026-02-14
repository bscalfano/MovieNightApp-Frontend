function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mb-4"></div>
      <p className="text-xl text-gray-600">{message}</p>
    </div>
  );
}

export default LoadingSpinner;