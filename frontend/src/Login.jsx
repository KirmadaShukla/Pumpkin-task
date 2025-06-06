import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { asynclogin } from './store/actions/userAction';

const LoginPage = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.user);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        await dispatch(asynclogin({ email, password }));
    };
    
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-200">
      <div className="h-auto bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-blue-600 rounded mr-2"></div>
          <h1 className="text-2xl font-bold">chat</h1>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage; 