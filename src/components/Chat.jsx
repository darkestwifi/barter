import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { format } from 'date-fns';

const Chat = () => {
  const { userId: recipientId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser || !recipientId) return;

    const chatId =
      currentUser.uid > recipientId
        ? `${recipientId}_${currentUser.uid}`
        : `${currentUser.uid}_${recipientId}`;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [currentUser, recipientId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    const chatId =
      currentUser.uid > recipientId
        ? `${recipientId}_${currentUser.uid}`
        : `${currentUser.uid}_${recipientId}`;

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: message,
        senderId: currentUser.uid,
        receiverId: recipientId,
        timestamp: serverTimestamp(),
      });
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!currentUser) {
    return (
      <div className="p-6 text-center text-gray-500">Loading chat...</div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto min-h-screen bg-white flex flex-col">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Chat with User
      </h2>

      <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-4 shadow-md mb-4 space-y-2">
        {messages.map((msg) => {
          const isSender = msg.senderId === currentUser.uid;
          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-2xl shadow-sm ${
                  isSender
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-300 text-black rounded-bl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-[10px] text-gray-200 mt-1 text-right">
                  {msg.timestamp?.toDate
                    ? format(msg.timestamp.toDate(), 'p')
                    : ''}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
