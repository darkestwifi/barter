import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, Mail, Info, Code, Award, CheckCircle, XCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const navigate = useNavigate();

  const quizQuestions = {
    React: [
      { id: 1, question: 'What is a React component?', options: ['A) Function or class returning UI', 'B) CSS style', 'C) Database query', 'D) HTTP request'], correctAnswer: 'A' },
      { id: 2, question: 'What is JSX?', options: ['A) JavaScript XML', 'B) JSON extension', 'C) Java syntax', 'D) XML schema'], correctAnswer: 'A' },
      { id: 3, question: 'What is the use of useState?', options: ['A) Manage state', 'B) Fetch data', 'C) Style components', 'D) Route navigation'], correctAnswer: 'A' },
      { id: 4, question: 'What does useEffect do?', options: ['A) Handles side effects', 'B) Renders UI', 'C) Manages props', 'D) Validates forms'], correctAnswer: 'A' },
      { id: 5, question: 'What is a prop in React?', options: ['A) Data passed to components', 'B) State variable', 'C) CSS property', 'D) Event handler'], correctAnswer: 'A' },
      { id: 6, question: 'What is the virtual DOM?', options: ['A) In-memory DOM copy', 'B) Real DOM', 'C) Database', 'D) Browser cache'], correctAnswer: 'A' },
      { id: 7, question: 'What is React Router used for?', options: ['A) Navigation', 'B) State management', 'C) Styling', 'D) Data fetching'], correctAnswer: 'A' },
      { id: 8, question: 'What is a controlled component?', options: ['A) Form with state-controlled inputs', 'B) Unstyled component', 'C) Async component', 'D) Nested component'], correctAnswer: 'A' },
      { id: 9, question: 'What does setState do?', options: ['A) Updates state', 'B) Renders UI', 'C) Fetches data', 'D) Defines props'], correctAnswer: 'A' },
      { id: 10, question: 'What is the purpose of keys in lists?', options: ['A) Optimize rendering', 'B) Style elements', 'C) Handle events', 'D) Store data'], correctAnswer: 'A' },
      { id: 11, question: 'What is Redux used for?', options: ['A) State management', 'B) Routing', 'C) Animation', 'D) Testing'], correctAnswer: 'A' },
      { id: 12, question: 'What is a React Hook?', options: ['A) Function for state/effects', 'B) CSS rule', 'C) Database hook', 'D) Event listener'], correctAnswer: 'A' },
      { id: 13, question: 'What is useCallback used for?', options: ['A) Memoize functions', 'B) Fetch data', 'C) Style components', 'D) Manage routes'], correctAnswer: 'A' },
      { id: 14, question: 'What is the Context API?', options: ['A) Global state sharing', 'B) Styling framework', 'C) Data fetching', 'D) Event system'], correctAnswer: 'A' },
      { id: 15, question: 'What is React.Fragment?', options: ['A) Wraps elements without extra DOM', 'B) State container', 'C) CSS fragment', 'D) Event wrapper'], correctAnswer: 'A' },
      { id: 16, question: 'What does useMemo do?', options: ['A) Memoizes values', 'B) Renders components', 'C) Handles events', 'D) Fetches data'], correctAnswer: 'A' },
      { id: 17, question: 'What is a higher-order component?', options: ['A) Component wrapping another', 'B) Styled component', 'C) Async component', 'D) Root component'], correctAnswer: 'A' },
      { id: 18, question: 'What is prop drilling?', options: ['A) Passing props through layers', 'B) Styling props', 'C) Fetching props', 'D) Validating props'], correctAnswer: 'A' },
      { id: 19, question: 'What is React’s useRef hook?', options: ['A) References DOM or values', 'B) Manages state', 'C) Styles elements', 'D) Routes pages'], correctAnswer: 'A' },
      { id: 20, question: 'What is the purpose of React.StrictMode?', options: ['A) Detects issues in development', 'B) Optimizes production', 'C) Styles components', 'D) Handles routing'], correctAnswer: 'A' },
    ],
    Python: [
      { id: 1, question: 'What is Python?', options: ['A) General-purpose language', 'B) Styling language', 'C) Database system', 'D) Markup language'], correctAnswer: 'A' },
      { id: 2, question: 'What is a Python list?', options: ['A) Ordered, mutable collection', 'B) Key-value store', 'C) Immutable array', 'D) Single value'], correctAnswer: 'A' },
      { id: 3, question: 'What does len() do?', options: ['A) Returns length', 'B) Adds elements', 'C) Removes elements', 'D) Sorts data'], correctAnswer: 'A' },
      { id: 4, question: 'What is a Python dictionary?', options: ['A) Key-value pairs', 'B) Ordered list', 'C) Single value', 'D) Immutable set'], correctAnswer: 'A' },
      { id: 5, question: 'What is a Python tuple?', options: ['A) Immutable sequence', 'B) Mutable list', 'C) Key-value store', 'D) Single variable'], correctAnswer: 'A' },
      { id: 6, question: 'What does def do?', options: ['A) Defines a function', 'B) Declares a variable', 'C) Imports a module', 'D) Loops data'], correctAnswer: 'A' },
      { id: 7, question: 'What is pip?', options: ['A) Package manager', 'B) Code editor', 'C) Database tool', 'D) Styling library'], correctAnswer: 'A' },
      { id: 8, question: 'What is a Python module?', options: ['A) Reusable code file', 'B) HTML template', 'C) CSS file', 'D) Database table'], correctAnswer: 'A' },
      { id: 9, question: 'What does import do?', options: ['A) Loads a module', 'B) Defines a class', 'C) Exports data', 'D) Styles code'], correctAnswer: 'A' },
      { id: 10, question: 'What is a Python class?', options: ['A) Blueprint for objects', 'B) Variable type', 'C) Function block', 'D) Loop structure'], correctAnswer: 'A' },
      { id: 11, question: 'What is the print() function?', options: ['A) Outputs to console', 'B) Saves to file', 'C) Fetches data', 'D) Styles text'], correctAnswer: 'A' },
      { id: 12, question: 'What does range() generate?', options: ['A) Sequence of numbers', 'B) Random values', 'C) Key-value pairs', 'D) HTML tags'], correctAnswer: 'A' },
      { id: 13, question: 'What is a Python lambda?', options: ['A) Anonymous function', 'B) Class definition', 'C) Loop structure', 'D) Module import'], correctAnswer: 'A' },
      { id: 14, question: 'What roster comprehension?', options: ['A) Concise list creation', 'B) Error handling', 'C) File reading', 'D) Styling lists'], correctAnswer: 'A' },
      { id: 15, question: 'What does try-except do?', options: ['A) Handles exceptions', 'B) Defines functions', 'C) Loops data', 'D) Imports modules'], correctAnswer: 'A' },
      { id: 16, question: 'What is __init__ in Python?', options: ['A) Constructor method', 'B) Loop initializer', 'C) Variable setter', 'D) Module loader'], correctAnswer: 'A' },
      { id: 17, question: 'What is a Python set?', options: ['A) Unique, unordered collection', 'B) Ordered list', 'C) Key-value store', 'D) Immutable array'], correctAnswer: 'A' },
      { id: 18, question: 'What does *args do?', options: ['A) Accepts variable arguments', 'B) Defines a class', 'C) Imports modules', 'D) Styles functions'], correctAnswer: 'A' },
      { id: 19, question: 'What is a Python generator?', options: ['A) Yields values one at a time', 'B) Creates classes', 'C) Styles code', 'D) Fetches data'], correctAnswer: 'A' },
      { id: 20, question: 'What is the purpose of virtualenv?', options: ['A) Isolated environments', 'B) Code styling', 'C) Database management', 'D) UI design'], correctAnswer: 'A' },
    ],
    JavaScript: [
      { id: 1, question: 'What is JavaScript?', options: ['A) Client-side scripting', 'B) Styling language', 'C) Database system', 'D) Markup language'], correctAnswer: 'A' },
      { id: 2, question: 'What is a closure?', options: ['A) Function with preserved data', 'B) CSS rule', 'C) Database query', 'D) HTML tag'], correctAnswer: 'A' },
      { id: 3, question: 'What does let do?', options: ['A) Declares block-scoped variable', 'B) Defines a function', 'C) Styles elements', 'D) Imports modules'], correctAnswer: 'A' },
      { id: 4, question: 'What is an array method?', options: ['A) Function on arrays', 'B) CSS property', 'C) Database call', 'D) Event listener'], correctAnswer: 'A' },
      { id: 5, question: 'What does map() do?', options: ['A) Transforms array elements', 'B) Removes elements', 'C) Adds elements', 'D) Styles arrays'], correctAnswer: 'A' },
      { id: 6, question: 'What is async/await?', options: ['A) Handles asynchronous code', 'B) Defines classes', 'C) Styles code', 'D) Loops arrays'], correctAnswer: 'A' },
      { id: 7, question: 'What is the DOM?', options: ['A) Document Object Model', 'B) Database', 'C) Styling framework', 'D) Module system'], correctAnswer: 'A' },
      { id: 8, question: 'What does addEventListener do?', options: ['A) Attaches event handlers', 'B) Styles elements', 'C) Fetches data', 'D) Defines variables'], correctAnswer: 'A' },
      { id: 9, question: 'What is a Promise?', options: ['A) Handles async results', 'B) CSS rule', 'C) Database query', 'D) HTML element'], correctAnswer: 'A' },
      { id: 10, question: 'What does fetch() do?', options: ['A) Makes HTTP requests', 'B) Defines functions', 'C) Styles pages', 'D) Loops data'], correctAnswer: 'A' },
      { id: 11, question: 'What is a JavaScript module?', options: ['A) Reusable code file', 'B) HTML template', 'C) CSS file', 'D) Database table'], correctAnswer: 'A' },
      { id: 12, question: 'What does const do?', options: ['A) Declares constant variable', 'B) Defines a loop', 'C) Styles elements', 'D) Imports data'], correctAnswer: 'A' },
      { id: 13, question: 'What is arrow function?', options: ['A) Concise function syntax', 'B) Class definition', 'C) Styling rule', 'D) Database query'], correctAnswer: 'A' },
      { id: 14, question: 'What is the spread operator?', options: ['A) Expands elements', 'B) Defines loops', 'C) Styles arrays', 'D) Fetches data'], correctAnswer: 'A' },
      { id: 15, question: 'What does JSON.stringify do?', options: ['A) Converts to string', 'B) Parses JSON', 'C) Styles JSON', 'D) Fetches JSON'], correctAnswer: 'A' },
      { id: 16, question: 'What is a callback function?', options: ['A) Function passed as argument', 'B) CSS rule', 'C) Database call', 'D) HTML tag'], correctAnswer: 'A' },
      { id: 17, question: 'What does querySelector do?', options: ['A) Selects DOM element', 'B) Defines variables', 'C) Styles pages', 'D) Loops arrays'], correctAnswer: 'A' },
      { id: 18, question: 'What is event delegation?', options: ['A) Handling events on parent', 'B) Styling events', 'C) Fetching events', 'D) Defining events'], correctAnswer: 'A' },
      { id: 19, question: 'What is the purpose of bind()?', options: ['A) Sets function context', 'B) Styles functions', 'C) Loops data', 'D) Imports modules'], correctAnswer: 'A' },
      { id: 20, question: 'What is a JavaScript prototype?', options: ['A) Object for inheritance', 'B) CSS rule', 'C) Database table', 'D) HTML element'], correctAnswer: 'A' },
    ],
    CSS: [
      { id: 1, question: 'What is CSS?', options: ['A) Styling language', 'B) Scripting language', 'C) Markup language', 'D) Database system'], correctAnswer: 'A' },
      { id: 2, question: 'What does display: flex do?', options: ['A) Enables flexbox', 'B) Hides elements', 'C) Defines grids', 'D) Animates elements'], correctAnswer: 'A' },
      { id: 3, question: 'What is a CSS selector?', options: ['A) Targets elements', 'B) Defines functions', 'C) Fetches data', 'D) Loops styles'], correctAnswer: 'A' },
      { id: 4, question: 'What does margin do?', options: ['A) Adds outside space', 'B) Adds inside space', 'C) Styles text', 'D) Defines layouts'], correctAnswer: 'A' },
      { id: 5, question: 'What is position: absolute?', options: ['A) Positions relative to ancestor', 'B) Stays in flow', 'C) Hides element', 'D) Animates element'], correctAnswer: 'A' },
      { id: 6, question: 'What is a media query?', options: ['A) Responsive design', 'B) Animation rule', 'C) Data fetch', 'D) Event handler'], correctAnswer: 'A' },
      { id: 7, question: 'What does box-sizing: border-box do?', options: ['A) Includes padding/border in width', 'B) Excludes padding', 'C) Styles boxes', 'D) Hides boxes'], correctAnswer: 'A' },
      { id: 8, question: 'What is a pseudo-class?', options: ['A) Styles based on state', 'B) Defines layouts', 'C) Fetches data', 'D) Loops styles'], correctAnswer: 'A' },
      { id: 9, question: 'What does z-index control?', options: ['A) Stacking order', 'B) Font size', 'C) Margin space', 'D) Animation speed'], correctAnswer: 'A' },
      { id: 10, question: 'What is the purpose of float?', options: ['A) Positions elements left/right', 'B) Styles text', 'C) Defines grids', 'D) Animates elements'], correctAnswer: 'A' },
      { id: 11, question: 'What is a CSS variable?', options: ['A) Reusable value', 'B) Function definition', 'C) Data fetch', 'D) Event handler'], correctAnswer: 'A' },
      { id: 12, question: 'What does transform do?', options: ['A) Modifies appearance', 'B) Hides elements', 'C) Defines layouts', 'D) Fetches data'], correctAnswer: 'A' },
      { id: 13, question: 'What is a CSS grid?', options: ['A) Two-dimensional layout', 'B) One-dimensional layout', 'C) Animation system', 'D) Data structure'], correctAnswer: 'A' },
      { id: 14, question: 'What does opacity control?', options: ['A) Transparency', 'B) Font size', 'C) Margin space', 'D) Animation speed'], correctAnswer: 'A' },
      { id: 15, question: 'What is a pseudo-element?', options: ['A) Styles part of element', 'B) Defines functions', 'C) Fetches data', 'D) Loops styles'], correctAnswer: 'A' },
      { id: 16, question: 'What does transition do?', options: ['A) Animates property changes', 'B) Hides elements', 'C) Defines grids', 'D) Fetches data'], correctAnswer: 'A' },
      { id: 17, question: 'What is the purpose of @keyframes?', options: ['A) Defines animations', 'B) Styles layouts', 'C) Fetches data', 'D) Handles events'], correctAnswer: 'A' },
      { id: 18, question: 'What does justify-content do?', options: ['A) Aligns flex items horizontally', 'B) Aligns vertically', 'C) Styles text', 'D) Hides elements'], correctAnswer: 'A' },
      { id: 19, question: 'What is a CSS preprocessor?', options: ['A) Extends CSS syntax', 'B) Defines layouts', 'C) Fetches data', 'D) Animates elements'], correctAnswer: 'A' },
      { id: 20, question: 'What does calc() do?', options: ['A) Performs calculations', 'B) Styles text', 'C) Defines grids', 'D) Hides elements'], correctAnswer: 'A' },
    ],
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          toast.error('You are not logged in, please log in');
          navigate('/login');
          return;
        }

        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const profileData = docSnap.data();
          if (!profileData.role) {
            profileData.role = 'student';
            await setDoc(docRef, { role: 'student' }, { merge: true });
          }
          setProfile(profileData);
        } else {
          toast.error('Profile not found');
          navigate('/profile-setup');
        }
      } catch (error) {
        toast.error(`Failed to load profile: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleShowQuiz = () => {
    if (!profile?.skill || !quizQuestions[profile.skill]) {
      toast.error('No quiz available for this skill');
      return;
    }
    const shuffled = [...quizQuestions[profile.skill]].sort(() => Math.random() - 0.5);
    setRandomQuestions(shuffled.slice(0, 5));
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(null);
    setShowQuiz(!showQuiz);
  };

  const handleQuizAnswer = (questionId, option) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleQuizSubmit = async () => {
    let correct = 0;
    randomQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setQuizSubmitted(true);

    if (auth.currentUser) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const updateData = {
        quizScore: correct,
        quizLastTaken: new Date().toISOString(),
      };
      await setDoc(userRef, updateData, { merge: true });
      setProfile((prev) => ({ ...prev, ...updateData }));
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(null);
    setRandomQuestions([]);
    setShowQuiz(false);
    setTimeout(() => handleShowQuiz(), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xl text-gray-600">
          Loading...
        </motion.p>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-lg shadow-lg"
      >
        {/* Tabs */}
        <div className="flex border-b">
          <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600">Profile</button>
        </div>

        {/* Profile Information */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
          <p className="text-gray-600">Manage your personal info</p>
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-lg font-semibold text-gray-900">{profile.name}</p>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Member since:</span>
              <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
            </li>
            <li className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Bio:</span>
              <span className="text-gray-900">{profile.bio || 'No bio provided'}</span>
            </li>
            {profile.role && (
              <li className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Role:</span>
                <span className="text-gray-900">{profile.role === 'mentor' ? 'Mentor' : 'Normal User'}</span>
              </li>
            )}
            {profile.role === 'mentor' && profile.skill && (
              <li className="flex items-center space-x-2">
                <Code className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Skill:</span>
                <span className="text-gray-900">{profile.skill}</span>
              </li>
            )}
            {profile.role === 'mentor' && profile.quizScore !== null && (
              <li className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Quiz Score:</span>
                <span className="text-gray-900">{profile.quizScore}/5</span>
                {profile.quizLastTaken && (
                  <span className="text-gray-600 text-sm ml-2">({new Date(profile.quizLastTaken).toLocaleDateString()})</span>
                )}
              </li>
            )}
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">Account Status:</span>
              <span className="text-gray-900">Verified</span>
            </li>
          </ul>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => navigate('/profile-setup')}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => navigate('/notes')}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Notes
            </button>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
            >
              Logout
            </button>
            {profile.role === 'mentor' && (
              <button
                onClick={handleShowQuiz}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
              >
                {showQuiz ? 'Hide Quiz' : `Take ${profile.skill} Quiz`}
              </button>
            )}
          </div>

          {/* Quiz Section */}
          {profile.role === 'mentor' && (
            <AnimatePresence>
              {showQuiz && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 space-y-4"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{profile.skill} Quiz</h3>
                  <p className="text-gray-600">Answer these 5 random questions to test your {profile.skill} skills.</p>
                  <div className="space-y-4">
                    {randomQuestions.map((q) => (
                      <div key={q.id} className="space-y-2">
                        <p className="text-gray-800">{q.question}</p>
                        {q.options.map((option) => (
                          <label key={option} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={option[0]}
                              checked={quizAnswers[q.id] === option[0]}
                              onChange={() => handleQuizAnswer(q.id, option[0])}
                              disabled={quizSubmitted}
                              className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option}</span>
                            {quizSubmitted && quizAnswers[q.id] === option[0] && (
                              quizAnswers[q.id] === q.correctAnswer ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )
                            )}
                          </label>
                        ))}
                      </div>
                    ))}
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleQuizSubmit}
                        disabled={quizSubmitted || Object.keys(quizAnswers).length < randomQuestions.length}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition"
                      >
                        {quizSubmitted ? 'Submitted' : 'Submit Quiz'}
                      </button>
                      {quizSubmitted && (
                        <button
                          onClick={handleRetakeQuiz}
                          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                        >
                          Retake Quiz
                        </button>
                      )}
                    </div>
                  </div>
                  {quizSubmitted && (
                    <div className="p-4 bg-blue-50 rounded-md">
                      <p className="text-gray-800 font-medium">Your Score: {score}/5</p>
                      <p className="text-gray-600">
                        {score === 5 ? 'Perfect! You’re a pro!' : score >= 3 ? 'Good job! Review mistakes.' : 'Keep learning!'}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;