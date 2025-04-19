import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-white text-gray-800 py-4 px-6 shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-blue-600 hover:text-blue-700 transition duration-300">
                    Barter<span className="text-gray-900">Connect</span>
                </Link>

                <ul className="flex space-x-8 text-md font-medium">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Signup', path: '/signup' },
                        { name: 'Services', path: '/services' },
                        { name: 'Offer Service', path: '/offerServices' },
                        { name: 'My Requests', path: '/my-requests' }, 
                        { name: 'Profile', path: '/profile' },
                        { name: 'About us', path: '/about' },
                    ].map((item, index) => (
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
        </nav>
    );
};

export default Navbar;
