import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, MapPin, Info, Code, Shield, Award } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error('User not authenticated');
          navigate('/signup');
          return;
        }

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          toast.error('Profile not found');
          navigate('/profile-setup');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error(`Failed to load profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-gray-600"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  if (!profile) {
    return null; // Redirect handled by useEffect
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6">
          <h2 className="text-3xl font-bold text-white">Your Profile</h2>
        </div>
        <div className="p-6 sm:p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center space-x-3"
          >
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <Mail className="w-6 h-6 text-blue-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-lg font-semibold text-gray-900">{profile.email}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-3"
          >
            <Award className="w-6 h-6 text-blue-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <span
                className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  profile.role === 'mentor'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </span>
            </div>
          </motion.div>
          {profile.bio && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-start space-x-3"
            >
              <Info className="w-6 h-6 text-blue-600" />
              <div>
                <label className="text-sm font-medium text-gray-600">Bio</label>
                <p className="text-lg text-gray-900">{profile.bio}</p>
              </div>
            </motion.div>
          )}
          {profile.location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-3"
            >
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <label className="text-sm font-medium text-gray-600">Location</label>
                <p className="text-lg text-gray-900">{profile.location}</p>
              </div>
            </motion.div>
          )}
          {profile.role === 'mentor' && profile.skills && profile.skills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-start space-x-3"
            >
              <Code className="w-6 h-6 text-blue-600" />
              <div>
                <label className="text-sm font-medium text-gray-600">Skills</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center space-x-3"
          >
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <label className="text-sm font-medium text-gray-600">User ID</label>
              <p className="text-lg text-gray-900 truncate">{profile.uid}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-end"
          >
            <button
              onClick={() => navigate('/profile-setup')}
              className="bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Edit Profile
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Profile;