import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import {
  Briefcase, Code, Brush, Settings, BookOpen, Globe
} from 'lucide-react';

const categoryIcons = {
  'Web Development': <Code className="w-6 h-6 text-blue-600" />,
  'Graphic Design': <Brush className="w-6 h-6 text-pink-500" />,
  'Technical Support': <Settings className="w-6 h-6 text-gray-600" />,
  'Tutoring': <BookOpen className="w-6 h-6 text-green-600" />,
  'Business Consulting': <Briefcase className="w-6 h-6 text-yellow-500" />,
  'Translation': <Globe className="w-6 h-6 text-indigo-600" />,
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(fetched);
    };
    fetchServices();
  }, []);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : services;

  const handleClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleSendRequest = async (service) => {
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to send a request.");
      return;
    }

    if (user.uid === service.ownerId) {
      alert("You cannot request your own service.");
      return;
    }

    try {
      await addDoc(collection(db, "requests"), {
        serviceId: service.id,
        serviceTitle: service.title,
        fromUserId: user.uid,
        toUserId: service.ownerId,
        status: "pending",
        createdAt: Timestamp.now()
      });
      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  const uniqueCategories = [...new Set(services.map((s) => s.category))];

  const DemoAd = () => {
    return (
      <div className="demo-ad my-10 px-4 sm:px-0">
        <a href="https://www.w3schools.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https"
            className="w-full h-auto max-h-[300px] object-cover rounded-xl shadow-lg"
            alt="W3Schools Ad"
          />
        </a>
      </div>
    );
  };

  return (
    <section className="min-h-screen bg-white px-4 sm:px-6 py-16">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6"
        >
          Our Top Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mb-12 max-w-2xl mx-auto text-sm sm:text-base"
        >
          Discover the range of services our community offers. Click a category to view all related services.
        </motion.p>

        {/* Category filter buttons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
          {uniqueCategories.map((category, idx) => (
            <button
              key={idx}
              onClick={() => handleClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border-blue-600'
              } transition`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition text-left"
            >
              <div className="mb-3">
                {categoryIcons[service.category] || (
                  <Briefcase className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-800">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm text-blue-500 mb-1">
                {service.category}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3">
                {service.description}
              </p>

              <button
                onClick={() => handleSendRequest(service)}
                className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
              >
                Send Request
              </button>
            </motion.div>
          ))}
        </div>

        {/* Demo Ad */}
        <DemoAd />
      </div>
    </section>
  );
};

export default Services;
