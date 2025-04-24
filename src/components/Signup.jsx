import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { auth, db } from '../firebase';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (loading) return;
    if (user) {
      console.log('User already logged in, redirecting to /profile');
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
    if (isSubmitting || isCheckingEmail) return;
    setIsCheckingEmail(true);

    try {
      // Validate email
      if (!formData.email || typeof formData.email !== 'string') {
        console.log('Invalid email:', formData.email);
        toast.error('Please enter a valid email address');
        setIsCheckingEmail(false);
        return;
      }

      console.log('Checking Firebase email:', formData.email);
      // Check if email is already registered in Firebase
      const signInMethods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (signInMethods.length > 0) {
        console.log('Email already in use');
        toast.error('Email already in use');
        setIsCheckingEmail(false);
        return;
      }

      // Proceed with account creation
      console.log('Creating account...');
      setIsSubmitting(true);
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save user profile to Firestore
      console.log('Saving user profile to Firestore, uid:', user.uid);
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: 'student',
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      console.log('Account created and profile saved');
      toast.success('Account created successfully!');
      navigate('/profile-setup');
    } catch (err) {
      console.error('Signup error:', err);
      toast.error(`Failed to sign up: ${err.message}`);
    } finally {
      setIsCheckingEmail(false);
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
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <div className="mt-1 relative">
              <User className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isSubmitting || isCheckingEmail}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isSubmitting || isCheckingEmail}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <div className="mt-1 relative">
              <Lock className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                disabled={isSubmitting || isCheckingEmail}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || isCheckingEmail}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting || isCheckingEmail ? 'Processing...' : 'Sign Up'}</span>
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </motion.section>
  );
};

export default Signup;