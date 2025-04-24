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
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({ name: '', bio: '', location: '', skill: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!formData.name) {
        toast.error('Name is required');
        setIsSubmitting(false);
        return;
      }
      if (role === 'mentor' && !formData.skill) {
        toast.error('Please select a skill');
        setIsSubmitting(false);
        return;
      }

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
    <section className="min-h-screen flex items-center justify-center bg-blue-50 px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg"
      >
        {!role ? (
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
              Choose Your Profile Type
            </h2>
            <p className="text-gray-600 mb-8">
              Select whether you want to be a Mentor or a Normal user.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleRoleSelect('normal')}
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition"
              >
                Normal User
              </button>
              <button
                onClick={() => handleRoleSelect('mentor')}
                className="bg-green-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-green-700 transition"
              >
                Mentor
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="">Select a skill</option>
                  <option value="React">React</option>
                  <option value="Python">Python</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="CSS">CSS</option>
                </select>
              </div>
            )}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setRole(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
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