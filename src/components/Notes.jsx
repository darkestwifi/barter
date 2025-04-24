import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { PlusCircle, Edit, Trash, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
  const [user, loading] = useAuthState(auth);
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchNotes = async () => {
      try {
        const notesRef = collection(db, `users/${user.uid}/notes`);
        const notesSnap = await getDocs(notesRef);
        setNotes(notesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to load notes');
      }
    };
    fetchNotes();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (!formData.title) {
        toast.error('Title is required');
        setIsSubmitting(false);
        return;
      }

      if (!user) {
        toast.error('User not authenticated');
        setIsSubmitting(false);
        navigate('/login');
        return;
      }

      const noteData = {
        title: formData.title,
        body: formData.body,
        updatedAt: new Date().toISOString(),
      };

      if (isEditing) {
        const noteRef = doc(db, `users/${user.uid}/notes`, editNoteId);
        await updateDoc(noteRef, noteData);
        setNotes((prev) =>
          prev.map((note) =>
            note.id === editNoteId ? { ...note, ...noteData } : note
          )
        );
        toast.success('Note updated successfully!');
      } else {
        noteData.createdAt = new Date().toISOString();
        const notesRef = collection(db, `users/${user.uid}/notes`);
        const docRef = await addDoc(notesRef, noteData);
        setNotes((prev) => [...prev, { id: docRef.id, ...noteData }]);
        toast.success('Note created successfully!');
      }

      setFormData({ title: '', body: '' });
      setShowForm(false);
      setIsEditing(false);
      setEditNoteId(null);
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error(`Failed to save note: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note) => {
    setFormData({ title: note.title, body: note.body });
    setIsEditing(true);
    setEditNoteId(note.id);
    setShowForm(true);
  };

  const handleDelete = async (noteId) => {
    try {
      const noteRef = doc(db, `users/${user.uid}/notes`, noteId);
      await deleteDoc(noteRef);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
      toast.success('Note deleted successfully!');
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    }
  };

  const handleViewNote = (note) => {
    setViewNote(note);
  };

  const closeModal = () => {
    setViewNote(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-gray-600"
        >
          Loading...
        </motion.p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between mt-12 items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">My Notes</h1>
          <button
            onClick={() => {
              setFormData({ title: '', body: '' });
              setIsEditing(false);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-green-700 transition-transform transform hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Note</span>
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg mb-6"
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-4">
                {isEditing ? 'Edit Note' : 'Create Note'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Body</label>
                  <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="6"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : isEditing ? 'Update Note' : 'Save Note'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {notes.length === 0 ? (
          <p className="text-gray-600 text-center">No notes yet. Create your first note!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-4 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => handleViewNote(note)}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{note.title}</h3>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {note.body.length > 50 ? `${note.body.slice(0, 50)}...` : note.body}
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(note);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {viewNote && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-blue-600">{viewNote.title}</h2>
                  <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{viewNote.body}</p>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      handleEdit(viewNote);
                      closeModal();
                    }}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(viewNote.id);
                      closeModal();
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                  >
                    <Trash className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
};

export default Notes;
