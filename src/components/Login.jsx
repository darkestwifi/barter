import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn } from 'lucide-react';
import { auth } from '../firebase';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Input change:', { name, value });
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!formData.email || typeof formData.email !== 'string') {
        console.log('Invalid email:', formData.email);
        toast.error('Please enter a valid email address');
        setIsSubmitting(false);
        return;
      }
      if (!formData.password || typeof formData.password !== 'string') {
        console.log('Invalid password:', formData.password);
        toast.error('Please enter a valid password');
        setIsSubmitting(false);
        return;
      }

      console.log('Attempting login:', formData.email);
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('Login successful');
      toast.success('Logged in successfully!');
      navigate('/profile');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(`Failed to log in: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 py-10"
    >
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 text-center">
          Log In to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Logging in...' : 'Log In'}</span>
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </motion.section>
  );
};

export default Login;