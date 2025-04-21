import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // For hamburger and close icons

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Signup', path: '/signup' },
        { name: 'Services', path: '/services' },
        { name: 'Offer Service', path: '/offerServices' },
        { name: 'My Requests', path: '/my-requests' },
        { name: 'Profile', path: '/profile' },
        { name: 'About us', path: '/about' },
    ];

    return (
        <nav className="bg-white text-gray-800 py-4 px-6 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition duration-300">
                    Barter<span className="text-gray-900">Connect</span>
                </Link>

                {/* Hamburger Button */}
                <button className="md:hidden text-gray-700" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 text-md font-medium">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className="relative inline-block text-gray-700 hover:text-blue-600 transition duration-300 group"
                            >
                                <span>{item.name}</span>
                                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <ul className="md:hidden mt-4 space-y-4 text-md font-medium px-4">
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className="block text-gray-700 hover:text-blue-600 transition duration-300"
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;
