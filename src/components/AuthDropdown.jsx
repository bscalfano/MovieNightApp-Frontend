import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';

function AuthDropdown({ type = 'login' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(loginForm.email, loginForm.password);
      toast.success('Welcome back!');
      navigate('/calendar');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await authService.register(
        registerForm.email,
        registerForm.password,
        registerForm.firstName,
        registerForm.lastName
      );
      toast.success('Account created successfully!');
      navigate('/calendar');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMsg = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data || 'Registration failed';
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  if (type === 'login') {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-[#252836] rounded-lg shadow-xl py-4 px-6 z-50 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Log In</h3>
        <form onSubmit={handleLoginSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
              className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
              className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#40BCF4] text-white py-2 rounded-lg hover:bg-[#35a5d9] transition font-semibold disabled:opacity-50 text-sm"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    );
  }

  // Register form
  return (
    <div className="absolute right-0 mt-2 w-80 bg-[#252836] rounded-lg shadow-xl py-4 px-6 z-50 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">Sign Up</h3>
      <form onSubmit={handleRegisterSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={registerForm.firstName}
              onChange={handleRegisterChange}
              className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={registerForm.lastName}
              onChange={handleRegisterChange}
              className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={registerForm.email}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={registerForm.password}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange}
            required
            className="w-full px-3 py-2 bg-[#2d3142] border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40BCF4] placeholder-gray-500 text-sm"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#40BCF4] text-white py-2 rounded-lg hover:bg-[#35a5d9] transition font-semibold disabled:opacity-50 text-sm"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default AuthDropdown;