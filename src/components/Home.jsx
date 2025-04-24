import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Search, ArrowRight } from 'lucide-react';
import Navbar from './Navbar'; // Make sure path is correct based on your file structure

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F0F8FF] flex flex-col">
      {/* Reusable Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F0F8FF] to-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1E90FF] mb-4"
        >
          Welcome to Barter Connect
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl"
        >
          Exchange skills, learn together, and grow faster with peers and mentors.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/signup"
            className="bg-[#1E90FF] text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center hover:bg-[#FF9999] transition-transform transform hover:scale-105"
          >
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            to="/services"
            className="bg-white text-[#1E90FF] px-6 py-3 rounded-lg font-semibold flex items-center justify-center border border-[#1E90FF] hover:bg-[#1E90FF] hover:text-white transition-transform transform hover:scale-105"
          >
            Explore Services
          </Link>
        </motion.div>
      </section>

      {/* Features Section with Links */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-[#F0F8FF] rounded-lg shadow-md text-center"
          >
            <Link to="/my-requests">
              <Users className="w-12 h-12 text-[#1E90FF] mx-auto mb-4 cursor-pointer hover:text-[#FF9999] transition" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect with Peers</h3>
              <p className="text-gray-600">Join a community of learners and mentors to share knowledge and grow together.</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="p-6 bg-[#F0F8FF] rounded-lg shadow-md text-center"
          >
            <Link to="/offerServices">
              <BookOpen className="w-12 h-12 text-[#1E90FF] mx-auto mb-4 cursor-pointer hover:text-[#FF9999] transition" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Exchange Skills</h3>
              <p className="text-gray-600">Teach what you know and learn what you need through skill bartering.</p>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-6 bg-[#F0F8FF] rounded-lg shadow-md text-center"
          >
            <Link to="/courses">
              <Search className="w-12 h-12 text-[#1E90FF] mx-auto mb-4 cursor-pointer hover:text-[#FF9999] transition" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Discover Opportunities</h3>
              <p className="text-gray-600">Find new skills and services to enhance your learning journey.</p>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E90FF] text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm sm:text-base mb-4 sm:mb-0">© 2025 Barter Connect. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/about" className="text-sm sm:text-base hover:text-[#FF9999] transition">About</Link>
            <Link to="/services" className="text-sm sm:text-base hover:text-[#FF9999] transition">Services</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
