import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, password } = formData;

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });

      // Save user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        uid: user.uid,
        location: 'Bareilly, India',
        bio: 'Frontend Developer passionate about clean UI, innovation, and collaboration.',
        skills: ['React', 'Tailwind CSS', 'Firebase', 'Teamwork'],
        image: '/images/default-avatar.png',
        createdAt: serverTimestamp(),
      });

      navigate(`/profile/${user.uid}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-blue-600 text-center">Sign Up</h2>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 outline-none text-sm"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 outline-none text-sm"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 outline-none text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-semibold transition"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Already a member?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </motion.form>
    </section>
  );
};

export default Signup;
