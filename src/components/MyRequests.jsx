import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const MyRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch requests and services
  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // Fetch sent requests
      const sentQuery = query(
        collection(db, 'requests'),
        where('fromUserId', '==', user.uid)
      );
      const sentSnap = await getDocs(sentQuery);
      const sentData = sentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch received requests
      const receivedQuery = query(
        collection(db, 'requests'),
        where('toUserId', '==', user.uid)
      );
      const receivedSnap = await getDocs(receivedQuery);
      const receivedData = receivedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch services offered by the user
      const servicesQuery = query(
        collection(db, 'services'),
        where('userId', '==', user.uid)
      );
      const servicesSnap = await getDocs(servicesQuery);
      const servicesData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Update state
      setSentRequests(sentData);
      setReceivedRequests(receivedData);
      setServices(servicesData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  // Handle request action (accept/reject)
  const handleRequestAction = async (requestId, action, toUserId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, { status: action });

      alert(`Request ${action} successfully!`);
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error updating request status:", err);
      alert('Failed to update request status.');
    }
  };

  // Handle request deletion
  const handleDeleteRequest = async (requestId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const requestRef = doc(db, 'requests', requestId);
      await deleteDoc(requestRef);
      alert('Request deleted successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error deleting request:", err);
      alert('Failed to delete request.');
    }
  };

  // Handle service deletion
  const handleDeleteService = async (serviceId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const serviceRef = doc(db, 'services', serviceId);
      await deleteDoc(serviceRef);
      alert('Service deleted successfully!');
      fetchData(); // Refresh data
    } catch (err) {
      console.error("Error deleting service:", err);
      alert('Failed to delete service.');
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
      <div className="max-w-full sm:max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-6 text-center sm:text-left">My Requests</h2>

        {loading ? (
          <div className="text-center text-gray-500 text-sm sm:text-base">Loading...</div>
        ) : (
          <>
            {/* Sent Requests */}
            <div className="mb-8 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Sent Requests</h3>
              {sentRequests.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">No sent requests.</p>
              ) : (
                <ul className="space-y-4">
                  {sentRequests.map((req) => (
                    <li
                      key={req.id}
                      className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col gap-3"
                    >
                      <div>
                        <p className="text-sm sm:text-base"><strong>Service Title:</strong> {req.serviceTitle}</p>
                        <p className="text-sm sm:text-base"><strong>Status:</strong> {req.status}</p>
                      </div>

                      {req.status === 'accepted' && (
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                          <button
                            onClick={() => navigate(`/profile/${req.toUserId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${req.toUserId}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                          >
                            Chat
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 sm:gap-4">
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Received Requests */}
            <div className="mb-8 sm:mb-10">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Received Requests</h3>
              {receivedRequests.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">No incoming requests.</p>
              ) : (
                <ul className="space-y-4">
                  {receivedRequests.map((req) => (
                    <li
                      key={req.id}
                      className="p-4 bg-blue-50 rounded-lg shadow-sm flex flex-col gap-3"
                    >
                      <div>
                        <p className="text-sm sm:text-base"><strong>Service Title:</strong> {req.serviceTitle}</p>
                        <p className="text-sm sm:text-base"><strong>From User:</strong> {req.fromUserId}</p>
                        <p className="text-sm sm:text-base"><strong>Status:</strong> {req.status}</p>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                          <button
                            onClick={() => handleRequestAction(req.id, 'accepted', req.fromUserId)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, 'rejected', req.fromUserId)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : req.status === 'accepted' && (
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                          <button
                            onClick={() => navigate(`/profile/${req.fromUserId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${req.fromUserId}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                          >
                            Chat
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 sm:gap-4">
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Offered Services */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">My Offered Services</h3>
              {services.length === 0 ? (
                <p className="text-gray-500 text-sm sm:text-base">No services offered yet.</p>
              ) : (
                <ul className="space-y-4">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="p-4 bg-yellow-50 rounded-lg shadow-sm flex flex-col gap-3"
                    >
                      <div>
                        <p className="text-sm sm:text-base"><strong>Service Title:</strong> {service.title}</p>
                        <p className="text-sm sm:text-base"><strong>Description:</strong> {service.description}</p>
                        <p className="text-sm sm:text-base"><strong>Status:</strong> {service.status}</p>
                      </div>

                      <div className="flex justify-end gap-2 sm:gap-4">
                        <button
                          onClick={() => navigate(`/profile/${service.userId}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1 rounded text-xs sm:text-sm"
                        >
                          Delete Service
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyRequests;