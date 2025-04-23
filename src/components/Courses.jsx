import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Brush, Settings, BookOpen, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categoryIcons = {
  'Web Development': <Code className="w-6 h-6 text-blue-600" />,
  'Graphic Design': <Brush className="w-6 h-6 text-pink-500" />,
  'Technical Support': <Settings className="w-6 h-6 text-gray-600" />,
  'Tutoring': <BookOpen className="w-6 h-6 text-green-600" />,
  'Business Consulting': <Briefcase className="w-6 h-6 text-yellow-500" />,
  'Translation': <Globe className="w-6 h-6 text-indigo-600" />,
};

const allServices = [
  {
    id: 1,
    title: 'Website Creation',
    category: 'Web Development',
    description: 'Build a responsive website tailored to your needs using modern frameworks like React or Vue.js.',
  },
  {
    id: 2,
    title: 'Logo Design',
    category: 'Graphic Design',
    description: 'Create a unique and professional logo that represents your brand identity.',
  },
  {
    id: 3,
    title: 'IT Support',
    category: 'Technical Support',
    description: 'Get help with troubleshooting, software setup, or network issues from an experienced technician.',
  },
  {
    id: 4,
    title: 'Math Tutoring',
    category: 'Tutoring',
    description: 'Learn mathematics from algebra to calculus with personalized tutoring sessions.',
  },
  {
    id: 5,
    title: 'Business Strategy',
    category: 'Business Consulting',
    description: 'Develop a growth strategy for your startup or small business with expert advice.',
  },
  {
    id: 6,
    title: 'Language Translation',
    category: 'Translation',
    description: 'Translate documents or content between English, Spanish, or French with high accuracy.',
  },
];

const Courses = () => {
  const navigate = useNavigate();

  const handleCardClick = (serviceId) => {
    if (serviceId === 1) { // Only navigate for "Website Creation" card
      navigate('/website');
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl font-bold text-blue-600 text-center mb-6"
        >
          Explore Our Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-center mb-12 max-w-2xl mx-auto text-sm sm:text-base"
        >
          Discover a variety of skills offered by our community.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allServices.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(service.id)}
              className={`bg-gray-50 p-5 rounded-xl shadow hover:shadow-lg transition text-left ${service.id === 1 ? 'cursor-pointer' : 'cursor-default'}`}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;