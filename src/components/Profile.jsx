import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isOwnProfile = !userId || userId === currentUser?.uid;

  useEffect(() => {
    if (!currentUser && isOwnProfile) {
      const timer = setTimeout(() => navigate('/signup'), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, isOwnProfile, navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isOwnProfile && userId) {
        try {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            setOtherUser(userDoc.data());
          } else {
            console.log('No such user found in Firestore');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId, isOwnProfile]);

  if (!currentUser && isOwnProfile) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 font-semibold text-lg">
        You are not logged in. Redirecting to Sign Up...
      </div>
    );
  }

  const user = isOwnProfile
    ? {
        name: currentUser?.displayName || currentUser?.email || 'Your Name',
        location: 'Bareilly, India',
        bio: 'Frontend Developer passionate about clean UI, innovation, and collaboration.',
        skills: ['React', 'Tailwind CSS', 'Firebase', 'Teamwork'],
      }
    : {
        name: otherUser?.name || 'Unknown User',
        location: otherUser?.location || 'Unknown',
        bio: otherUser?.bio || 'No bio available.',
        skills: otherUser?.skills || [],
      };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 sm:p-10 flex flex-col items-center">
        {loading ? (
          <p className="text-gray-500">Loading profile...</p>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-blue-700">{user.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{user.location}</p>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">About Me</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{user.bio}</p>
            </div>

            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {!isOwnProfile && (
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/chat/${userId}`)}
                  className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition"
                >
                  Start Chat
                </button>
              </div>
            )}

            {isOwnProfile && (
              <div className="mt-10 w-full flex justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-600 px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-200 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
