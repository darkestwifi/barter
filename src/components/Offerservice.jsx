import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase'; // adjust the path based on your structure

const OfferService = () => {
  const [service, setService] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
  });

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getAuth().currentUser;
    if (!user) {
      alert('You must be logged in to offer a service!');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...service,
        tags: service.tags.split(',').map(tag => tag.trim()),
        createdAt: serverTimestamp(),
        ownerId: user.uid,
      });
      console.log('Service Submitted with ID:', docRef.id);
      alert('Service successfully submitted!');
      setService({ title: '', category: '', description: '', tags: '' });
    } catch (error) {
      console.error('Error submitting service:', error);
      alert('Failed to submit service. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg sm:max-w-xl lg:max-w-2xl space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-md"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-6">
            Offer a Service
          </h2>

          <div>
            <label className="block mb-1 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={service.title}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Logo Design"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={service.category}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Graphic Design"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="Describe your service..."
              rows={4}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={service.tags}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. design, creative, branding"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
          >
            Submit Service
          </button>
        </form>
      </div>
    </div>
  );
};

export default OfferService;
