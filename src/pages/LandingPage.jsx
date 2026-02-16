import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1a1d29]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-20">
          <div className="flex items-center gap-3">
            <div className="bg-[#40BCF4] p-3 rounded-lg shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Movie Night</h1>
          </div>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="bg-transparent border-2 border-[#40BCF4] text-[#40BCF4] px-6 py-3 rounded-lg hover:bg-[#40BCF4] hover:text-white transition font-semibold"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-[#40BCF4] text-white px-6 py-3 rounded-lg hover:bg-[#35a5d9] transition font-semibold shadow-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-24 mt-16">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
            Never Miss Movie Night Again
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Plan, schedule, and share movie nights with friends. Keep track of what you've watched and discover what's coming up.
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#40BCF4] text-white px-10 py-4 rounded-lg hover:bg-[#35a5d9] transition font-bold text-xl shadow-xl"
          >
            Get Started Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-[#252836] rounded-lg p-8 text-white border border-gray-700 hover:border-[#40BCF4] transition">
            <div className="bg-[#40BCF4] w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Easy Scheduling</h3>
            <p className="text-gray-400 leading-relaxed">
              Create movie nights with just a few clicks. Search for movies, set the date and time, and you're done.
            </p>
          </div>

          <div className="bg-[#252836] rounded-lg p-8 text-white border border-gray-700 hover:border-[#40BCF4] transition">
            <div className="bg-[#40BCF4] w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Share with Friends</h3>
            <p className="text-gray-400 leading-relaxed">
              Connect with friends, view their calendars, and RSVP to their movie nights. Build your movie-watching community.
            </p>
          </div>

          <div className="bg-[#252836] rounded-lg p-8 text-white border border-gray-700 hover:border-[#40BCF4] transition">
            <div className="bg-[#40BCF4] w-16 h-16 rounded-lg flex items-center justify-center mb-6 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Track Your History</h3>
            <p className="text-gray-400 leading-relaxed">
              Keep a record of all the movies you've watched. Look back at past movie nights and relive the memories.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 mt-20 pb-8">
        <p>© 2026 Movie Night. Made with ❤️ for movie lovers.</p>
      </div>
    </div>
  );
}

export default LandingPage;