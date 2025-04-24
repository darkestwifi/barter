import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileSetup = () => {
  const [role, setRole] = useState(null); // 'mentor' or 'normal'
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    skill: '', // Single skill for mentors
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ name: '', bio: '', location: '', skill: '' });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (role === 'mentor' && !formData.skill) newErrors.skill = 'Please select a skill';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (!validateForm()) return; // Form validation

    setIsSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('User not authenticated');
        setIsSubmitting(false);
        return;
      }

      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        role,
        email: user.email,
        uid: user.uid,
      });

      toast.success('Profile created successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Error setting up profile:', error);
      toast.error(`Failed to create profile: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-indigo-100 to-blue-50 px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-white p-8 rounded-lg shadow-lg transform transition-all"
      >
        {!role ? (
          <div className="text-center">
            <motion.h2
              className="text-3xl font-bold text-blue-600 mb-8"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Choose Your Profile Type
            </motion.h2>
            <p className="text-gray-600 mb-6 text-lg">Select whether you want to be a Mentor or a Normal user.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => handleRoleSelect('normal')}
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                Normal User
              </motion.button>
              <motion.button
                onClick={() => handleRoleSelect('mentor')}
                className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                Mentor
              </motion.button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-3xl font-semibold text-blue-600 mb-6 text-center">
              {role === 'mentor' ? 'Mentor Profile Setup' : 'Normal Profile Setup'}
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`mt-2 w-full px-4 py-3 rounded-md border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="mt-2 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                rows="4"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-2 w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>
            {role === 'mentor' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Skill</label>
                <select
                  name="skill"
                  value={formData.skill}
                  onChange={handleInputChange}
                  required
                  className={`mt-2 w-full px-4 py-3 rounded-md border ${errors.skill ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a skill</option>
                  <option value="React">React</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="CSS">CSS</option>
                </select>
                {errors.skill && <p className="text-xs text-red-500 mt-1">{errors.skill}</p>}
              </div>
            )}
            <div className="flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setRole(null)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 text-lg"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </section>
  );
};

export default ProfileSetup;
