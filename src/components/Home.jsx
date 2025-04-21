import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Code, Brush, Settings, BookOpen, Globe } from 'lucide-react';

const allServices = [
  {
    id: 1,
    title: 'Portfolio Website',
    category: 'Web Development',
    icon: <Code className="w-6 h-6 text-blue-600" />,
    description: 'Create a personal portfolio site with responsive design.',
  },
  {
    id: 2,
    title: 'E-commerce Platform',
    category: 'Web Development',
    icon: <Code className="w-6 h-6 text-blue-600" />,
    description: 'Set up a small online store with React and Firebase.',
  },
  {
    id: 3,
    title: 'Logo Design',
    category: 'Graphic Design',
    icon: <Brush className="w-6 h-6 text-pink-500" />,
    description: 'Design a custom logo tailored to your brand identity.',
  },
  {
    id: 4,
    title: 'Poster & Banner Design',
    category: 'Graphic Design',
    icon: <Brush className="w-6 h-6 text-pink-500" />,
    description: 'Create eye-catching banners for your social media or events.',
  },
  {
    id: 5,
    title: 'Laptop Troubleshooting',
    category: 'Technical Support',
    icon: <Settings className="w-6 h-6 text-gray-600" />,
    description: 'Fix software and basic hardware issues on laptops.',
  },
  {
    id: 6,
    title: 'Basic Programming Tutoring',
    category: 'Tutoring',
    icon: <BookOpen className="w-6 h-6 text-green-600" />,
    description: 'Teach Java or Python basics to students or beginners.',
  },
  {
    id: 7,
    title: 'Startup Guidance',
    category: 'Business Consulting',
    icon: <Briefcase className="w-6 h-6 text-yellow-500" />,
    description: 'Offer advice to early-stage entrepreneurs on planning and scaling.',
  },
  {
    id: 8,
    title: 'English to Spanish Translation',
    category: 'Translation',
    icon: <Globe className="w-6 h-6 text-indigo-600" />,
    description: 'Translate technical or academic content fluently.',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-600 mb-6 text-center"
      >
        Welcome to BarterConnect
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-base sm:text-lg text-gray-700 mb-10 sm:mb-12 text-center max-w-xl sm:max-w-2xl mx-auto"
      >
        Exchange your services with others without the need for money. Offer your skills and find what you need in return.
      </motion.p>

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-full sm:max-w-6xl mx-auto">
        {allServices.map((service) => (
          <motion.div
            key={service.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition text-left cursor-pointer touch:hover:shadow-md"
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">
              {service.title}
            </h3>
            <p className="text-xs sm:text-sm text-blue-500 mb-1">{service.category}</p>
            <p className="text-xs sm:text-sm text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 sm:mt-12 text-center">
        <Link
          to="/signup"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 sm:py-3 sm:px-6 rounded-full shadow-lg transition text-sm sm:text-base"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Home;