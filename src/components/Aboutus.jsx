import React from 'react';
import { motion } from 'framer-motion';

const team = [
  { name: "Aman Bhardwaj", role: "UI/UX Designer", img: "/images/aman.jpg" },
  { name: "Aishwarey Maheshwari", role: "Front End Developer", img: "/images/aish.jpg" },
  { name: "Jayesh P. Shukla", role: "Frontend Developer", img: "/images/jayesh.jpg" },
  { name: "Ayush Parashari", role: "Backend Developer", img: "/images/ayush.jpg" },
];

const testimonials = [
  {
    name: "Sneha Gupta",
    text: "BarterConnect helped me find a tutor in exchange for web dev services. It’s genius!",
    img: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Riya",
    text: "I exchanged my graphic design skills for fitness training. Loved the simplicity!",
    img: "https://i.pravatar.cc/150?img=47",
  },
  {
    name: "Ravi Sharma",
    text: "I taught someone photography and in return got help setting up my online store.",
    img: "https://i.pravatar.cc/150?img=12",
  },
  {
    name: "Rahul",
    text: "This platform feels like the future of collaboration. Barter made easy!",
    img: "https://i.pravatar.cc/150?img=55",
  },
];

const About = () => {
  return (
    <section className="bg-gray-50 py-16 sm:py-20 px-6 sm:px-8">
      <div className="max-w-full sm:max-w-5xl lg:max-w-7xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-6 sm:mb-8"
        >
          About BarterConnect
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto"
        >
          BarterConnect is a modern platform that empowers individuals to exchange skills, services, and resources without money.
          We believe in a collaborative future where people can grow through fair skill-sharing.
        </motion.p>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg mb-12 sm:mb-16"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            To revolutionize collaboration through an accessible, fair, and skill-powered community. 
            We connect talents, empower users, and help you grow while giving back.
          </p>
        </motion.div>

        {/* Team Members */}
        <h3 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">Meet the Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center transform transition duration-300 hover:shadow-xl hover:shadow-blue-200"
            >
              <div className="overflow-hidden w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 rounded-full mx-auto mb-4">
                <img
                  src={member.img}
                  alt={`Photo of ${member.name}, ${member.role}`}
                  className="object-cover w-full h-full rounded-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-700">{member.name}</h4>
              <p className="text-sm sm:text-base text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <h3 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 sm:mb-8">What Users Say</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <img src={t.img} alt={`Photo of ${t.name}`} className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover" />
                <h4 className="font-semibold text-gray-700 text-base sm:text-lg">{t.name}</h4>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
