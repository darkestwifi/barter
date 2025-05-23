import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Aboutus from './components/Aboutus';
import Profile from './components/Profile';
import Services from './components/Services';
import Signup from './components/Signup';
import OfferService from './components/Offerservice';
import MyRequests from './components/MyRequests';
import Chat from './components/Chat';
import Courses from './components/Courses';
import Website from './components/Website';
import ProfileSetup from './components/ProfileSetup';
import Notes from './components/Notes';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <Router>
      <Navbar />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/services" element={<Services />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/offerServices" element={<OfferService />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/website" element={<Website />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/notes" element={<Notes />} />
      </Routes>
    </Router>
  );
}

export default App;