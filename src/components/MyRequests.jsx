import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const MyRequests = () => {
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [mentorEnrollments, setMentorEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setLoading(true);

      // Fetch sent requests
      const sentQuery = query(collection(db, 'requests'), where('fromUserId', '==', user.uid));
      const sentSnap = await getDocs(sentQuery);
      const sentData = sentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch received requests
      const receivedQuery = query(collection(db, 'requests'), where('toUserId', '==', user.uid));
      const receivedSnap = await getDocs(receivedQuery);
      const receivedData = receivedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch services offered by the user
      const servicesQuery = query(collection(db, 'services'), where('userId', '==', user.uid));
      const servicesSnap = await getDocs(servicesQuery);
      const servicesData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch user's enrolled courses (mentors they enrolled with)
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const paidMentors = userDoc.exists() ? userDoc.data().paidMentors || [] : [];
      const enrolledList = [];
      for (const mentorId of paidMentors) {
        const mentorDoc = await getDoc(doc(db, 'users', mentorId));
        if (mentorDoc.exists()) {
          const mentorData = mentorDoc.data();
          enrolledList.push({
            id: mentorId,
            name: mentorData.name || 'Unnamed Mentor',
            skill: mentorData.skill || 'General',
            chatId: mentorId,
          });
        }
      }

      // Fetch enrollments for mentor (accepted requests for their services)
      const mentorRequestsQuery = query(
        collection(db, 'requests'),
        where('toUserId', '==', user.uid),
        where('status', '==', 'accepted')
      );
      const mentorRequestsSnap = await getDocs(mentorRequestsQuery);
      const mentorEnrollmentsData = [];
      for (const req of mentorRequestsSnap.docs) {
        const reqData = req.data();
        const fromUserDoc = await getDoc(doc(db, 'users', reqData.fromUserId));
        if (fromUserDoc.exists()) {
          const fromUserData = fromUserDoc.data();
          mentorEnrollmentsData.push({
            id: req.id,
            serviceTitle: reqData.serviceTitle,
            userName: fromUserData.name || 'Unnamed User',
            chatId: reqData.fromUserId,
          });
        }
      }

      setSentRequests(sentData);
      setReceivedRequests(receivedData);
      setServices(servicesData);
      setEnrolledCourses(enrolledList);
      setMentorEnrollments(mentorEnrollmentsData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, { status: action });
      alert(`Request ${action} successfully!`);
      fetchData();
    } catch (err) {
      console.error("Error updating request status:", err);
      alert('Failed to update request status.');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const requestRef = doc(db, 'requests', requestId);
      await deleteDoc(requestRef);
      alert('Request deleted successfully!');
      fetchData();
    } catch (err) {
      console.error("Error deleting request:", err);
      alert('Failed to delete request.');
    }
  };

  const handleDeleteService = async (serviceId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const serviceRef = doc(db, 'services', serviceId);
      await deleteDoc(serviceRef);
      alert('Service deleted successfully!');
      fetchData();
    } catch (err) {
      console.error("Error deleting service:", err);
      alert('Failed to delete service.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="max-w-full sm:max-w-3xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-blue-600 mb-4 text-center sm:text-left">My Requests</h2>

        {loading ? (
          <div className="text-center text-gray-500 text-xs sm:text-sm">Loading...</div>
        ) : (
          <>
            {/* Sent Requests */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Sent Requests</h3>
              {sentRequests.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">No sent requests.</p>
              ) : (
                <ul className="space-y-2">
                  {sentRequests.map((req) => (
                    <li
                      key={req.id}
                      className="p-2 bg-gray-100 rounded-md shadow-sm flex flex-col gap-1"
                    >
                      <div>
                        <p className="text-xs sm:text-sm"><strong>Title:</strong> {req.serviceTitle}</p>
                        <p className="text-xs sm:text-sm"><strong>Status:</strong> {req.status}</p>
                      </div>

                      {req.status === 'accepted' && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <button
                            onClick={() => navigate(`/profile/${req.toUserId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${req.toUserId}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                          >
                            Chat
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
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
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Received Requests</h3>
              {receivedRequests.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">No incoming requests.</p>
              ) : (
                <ul className="space-y-2">
                  {receivedRequests.map((req) => (
                    <li
                      key={req.id}
                      className="p-2 bg-blue-50 rounded-md shadow-sm flex flex-col gap-1"
                    >
                      <div>
                        <p className="text-xs sm:text-sm"><strong>Title:</strong> {req.serviceTitle}</p>
                        <p className="text-xs sm:text-sm"><strong>From:</strong> {req.fromUserId}</p>
                        <p className="text-xs sm:text-sm"><strong>Status:</strong> {req.status}</p>
                      </div>

                      {req.status === 'pending' ? (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <button
                            onClick={() => handleRequestAction(req.id, 'accepted')}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRequestAction(req.id, 'rejected')}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      ) : req.status === 'accepted' && (
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          <button
                            onClick={() => navigate(`/profile/${req.fromUserId}`)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => navigate(`/chat/${req.fromUserId}`)}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                          >
                            Chat
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Enrolled Courses (User Perspective) */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Enrolled Courses</h3>
              {enrolledCourses.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">No enrolled courses.</p>
              ) : (
                <ul className="space-y-2">
                  {enrolledCourses.map((course) => (
                    <li
                      key={course.id}
                      className="p-2 bg-green-50 rounded-md shadow-sm flex flex-col gap-1"
                    >
                      <div>
                        <p className="text-xs sm:text-sm"><strong>Mentor:</strong> {course.name}</p>
                        <p className="text-xs sm:text-sm"><strong>Skill:</strong> {course.skill}</p>
                      </div>
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => navigate(`/chat/${course.chatId}`)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                        >
                          Chat
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Mentor Enrollments (Mentor Perspective) */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold mb-2">My Enrollments (As Mentor)</h3>
              {mentorEnrollments.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">No enrollments for your services.</p>
              ) : (
                <ul className="space-y-2">
                  {mentorEnrollments.map((enrollment) => (
                    <li
                      key={enrollment.id}
                      className="p-2 bg-purple-50 rounded-md shadow-sm flex flex-col gap-1"
                    >
                      <div>
                        <p className="text-xs sm:text-sm"><strong>Service:</strong> {enrollment.serviceTitle}</p>
                        <p className="text-xs sm:text-sm"><strong>User:</strong> {enrollment.userName}</p>
                      </div>
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => navigate(`/chat/${enrollment.chatId}`)}
                          className="bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                        >
                          Chat
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Offered Services */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2">My Offered Services</h3>
              {services.length === 0 ? (
                <p className="text-gray-500 text-xs sm:text-sm">No services offered yet.</p>
              ) : (
                <ul className="space-y-2">
                  {services.map((service) => (
                    <li
                      key={service.id}
                      className="p-2 bg-yellow-50 rounded-md shadow-sm flex flex-col gap-1"
                    >
                      <div>
                        <p className="text-xs sm:text-sm"><strong>Title:</strong> {service.title}</p>
                        <p className="text-xs sm:text-sm"><strong>Description:</strong> {service.description}</p>
                        <p className="text-xs sm:text-sm"><strong>Status:</strong> {service.status}</p>
                      </div>
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <button
                          onClick={() => navigate(`/profile/${service.userId}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs"
                        >
                          Delete
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