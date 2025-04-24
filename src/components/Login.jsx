import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn } from 'lucide-react';
import { auth } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (loading) return;
    if (user) {
      toast.success('Already logged in, redirecting...');
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully');
      navigate('/profile');
    } catch (err) {
      toast.error(`Failed to log in: ${err.message}`);
    } finally {
      setIsSubmitting(false);
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

        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-3 sm:pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-xs sm:text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm text-gray-600 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-3 sm:pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 outline-none text-xs sm:text-sm"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-2.5 rounded-md font-semibold transition text-sm sm:text-base disabled:bg-blue-400"
        >
          <LogIn className="w-4 h-4" />
          <span>{isSubmitting ? 'Logging in...' : 'Login'}</span>
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