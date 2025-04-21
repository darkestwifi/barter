import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // adjust the path if needed

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile'); // Redirect after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-4 sm:space-y-5"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-center text-blue-600">Login</h2>

        {error && <p className="text-red-600 text-xs sm:text-sm text-center">{error}</p>}

        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-xs sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 sm:px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-xs sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-md font-semibold transition text-sm sm:text-base"
        >
          Login
        </button>

        <p className="text-xs sm:text-sm text-center text-gray-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;