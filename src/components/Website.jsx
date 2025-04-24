import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, BookOpen, DollarSign, CheckCircle, XCircle, Brain, ChevronDown, ChevronUp, PlayCircle, Map, FileCode, Palette, Braces, Wrench, Star } from 'lucide-react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, addDoc, collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Website = () => {
  const [activeTab, setActiveTab] = useState('free');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);
  const [user, setUser] = useState(null);
  const [paidMentors, setPaidMentors] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState({});
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [mentorError, setMentorError] = useState(null);
  const navigate = useNavigate();

  const quizQuestions = [
    { id: 1, question: 'What does HTML stand for?', options: ['A) HyperText Markup Language', 'B) HighText Machine Language', 'C) HyperTool Multi Language', 'D) HyperText Multi Language'], correctAnswer: 'A' },
    { id: 2, question: 'Which HTML tag defines a paragraph?', options: ['A) <p>', 'B) <div>', 'C) <span>', 'D) <para>'], correctAnswer: 'A' },
    { id: 3, question: 'What is the purpose of the HTML <meta> tag?', options: ['A) Styling', 'B) Metadata', 'C) Interactivity', 'D) Structure'], correctAnswer: 'B' },
    { id: 4, question: 'Which HTML attribute specifies an image’s alternative text?', options: ['A) src', 'B) alt', 'C) title', 'D) href'], correctAnswer: 'B' },
    { id: 5, question: 'What is a semantic HTML element?', options: ['A) Adds styling', 'B) Describes meaning', 'C) Adds scripts', 'D) Defines layout'], correctAnswer: 'B' },
    { id: 6, question: 'Which CSS property controls text size?', options: ['A) text-size', 'B) font-size', 'C) text-style', 'D) font-style'], correctAnswer: 'B' },
    { id: 7, question: 'What is the purpose of JavaScript?', options: ['A) Styling', 'B) Structure', 'C) Interactivity', 'D) Database'], correctAnswer: 'C' },
    { id: 8, question: 'What is a CSS media query used for?', options: ['A) Animations', 'B) Responsive design', 'C) Fonts', 'D) Events'], correctAnswer: 'B' },
    { id: 9, question: 'Which HTML tag is used for hyperlinks?', options: ['A) <link>', 'B) <a>', 'C) <href>', 'D) <url>'], correctAnswer: 'B' },
    { id: 10, question: 'What does the HTML <form> tag do?', options: ['A) Creates buttons', 'B) Collects user input', 'C) Adds images', 'D) Defines sections'], correctAnswer: 'B' },
    { id: 11, question: 'Which tool is used for version control?', options: ['A) Git', 'B) Figma', 'C) Vite', 'D) Firebase'], correctAnswer: 'A' },
    { id: 12, question: 'What is an API?', options: ['A) Styling framework', 'B) Data fetcher', 'C) Database', 'D) Editor'], correctAnswer: 'B' },
    { id: 13, question: 'What does the HTML <head> tag contain?', options: ['A) Main content', 'B) Metadata', 'C) Styles', 'D) Scripts'], correctAnswer: 'B' },
    { id: 14, question: 'Which CSS property aligns flex items horizontally?', options: ['A) align-items', 'B) justify-content', 'C) flex-direction', 'D) align-content'], correctAnswer: 'B' },
    { id: 15, question: 'What is the JavaScript method to add an array element?', options: ['A) push()', 'B) pop()', 'C) shift()', 'D) unshift()'], correctAnswer: 'A' },
    { id: 16, question: 'What is React used for?', options: ['A) Backend APIs', 'B) Component UIs', 'C) Databases', 'D) Styling'], correctAnswer: 'B' },
    { id: 17, question: 'What does SEO stand for?', options: ['A) Search Engine Optimization', 'B) System Error Output', 'C) Secure Event Operations', 'D) Search Engine Operations'], correctAnswer: 'A' },
    { id: 18, question: 'Which HTML element is used for a webpage’s main content?', options: ['A) <main>', 'B) <div>', 'C) <section>', 'D) <article>'], correctAnswer: 'A' },
    { id: 19, question: 'What is the purpose of ARIA in HTML?', options: ['A) Styling', 'B) Accessibility', 'C) Animation', 'D) Data fetching'], correctAnswer: 'B' },
    { id: 20, question: 'Which CSS unit is relative to viewport width?', options: ['A) px', 'B) rem', 'C) vw', 'D) em'], correctAnswer: 'C' },
    { id: 21, question: 'What is the HTML <input> tag used for?', options: ['A) Displaying text', 'B) User input', 'C) Linking pages', 'D) Adding images'], correctAnswer: 'B' },
    { id: 22, question: 'Which JavaScript event triggers on click?', options: ['A) onmouseover', 'B) onclick', 'C) onsubmit', 'D) onchange'], correctAnswer: 'B' },
    { id: 23, question: 'What is the purpose of the HTML <footer> tag?', options: ['A) Navigation', 'B) Footer content', 'C) Main content', 'D) Metadata'], correctAnswer: 'B' },
    { id: 24, question: 'Which CSS framework is utility-first?', options: ['A) Bootstrap', 'B) Tailwind CSS', 'C) Materialize', 'D) Bulma'], correctAnswer: 'B' },
    { id: 25, question: 'What does the HTML <nav> tag define?', options: ['A) Navigation links', 'B) Main content', 'C) Footer', 'D) Images'], correctAnswer: 'A' },
    { id: 26, question: 'Which CSS property creates a grid layout?', options: ['A) display: flex', 'B) display: grid', 'C) layout: grid', 'D) grid: auto'], correctAnswer: 'B' },
    { id: 27, question: 'What is the JavaScript async keyword used for?', options: ['A) Synchronous code', 'B) Asynchronous code', 'C) Styling', 'D) DOM manipulation'], correctAnswer: 'B' },
    { id: 28, question: 'Which tool is used for UI design?', options: ['A) Figma', 'B) Postman', 'C) Vite', 'D) ESLint'], correctAnswer: 'A' },
    { id: 29, question: 'What is the CSS ::before pseudo-element used for?', options: ['A) Event handling', 'B) Adding content before an element', 'C) Animation', 'D) Data fetching'], correctAnswer: 'B' },
    { id: 30, question: 'Which JavaScript method fetches data from an API?', options: ['A) fetch()', 'B) get()', 'C) request()', 'D) query()'], correctAnswer: 'A' },
  ];

  const htmlContent = {
    overview: {
      title: 'HTML: The Foundation of the Web',
      description: 'HTML (HyperText Markup Language) is the backbone of every website, defining its structure and content.',
      keyPoints: [
        'Semantic HTML improves accessibility and SEO.',
        'Forms collect user input (e.g., login, search).',
        'HTML5 introduced multimedia tags like <video> and <audio>.',
        'Works with CSS (styling) and JavaScript (interactivity).',
      ],
    },
    roadmap: [
      {
        stage: 'Beginner',
        title: 'Learn HTML Basics',
        description: 'Understand tags, attributes, and basic structure.',
        tasks: [
          'Create a webpage with <h1>, <p>, and <img>.',
          'Use <a> for links and <ul> for lists.',
          'Explore <div> and <span>.',
        ],
        resources: [
          { title: 'MDN HTML Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics' },
          { title: 'W3Schools HTML Tutorial', url: 'https://www.w3schools.com/html/' },
        ],
      },
    ],
    tutorials: [
      { title: 'HTML in 1 Hour (YouTube)', url: 'https://www.youtube.com/watch?v=ok-plXXHlWw', type: 'Video', duration: '1h' },
    ],
    tips: [
      'Use semantic tags (<article>, <section>) over <div>.',
      'Always include alt text for images.',
    ],
    codeSnippets: [
      {
        title: 'Basic HTML Structure',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Page</title>
</head>
<body>
  <h1>Welcome</h1>
  <p>Hello, world!</p>
</body>
</html>`,
      },
    ],
  };

  const cssContent = {
    overview: {
      title: 'CSS: Styling the Web',
      description: 'CSS (Cascading Style Sheets) transforms HTML into visually stunning websites with layouts, colors, fonts, and animations.',
      keyPoints: [
        'Controls visual presentation and layout.',
        'Responsive design with media queries.',
        'Frameworks like Tailwind CSS speed up styling.',
        'Animations enhance user experience.',
      ],
    },
    roadmap: [
      {
        stage: 'Beginner',
        title: 'Learn CSS Basics',
        description: 'Master selectors, properties, and basic styling.',
        tasks: [
          'Style text with font-size, color, text-align.',
          'Use margin, padding, and border.',
          'Apply styles with classes and IDs.',
        ],
        resources: [
          { title: 'MDN CSS Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics' },
        ],
      },
    ],
    tutorials: [
      { title: 'CSS Flexbox Tutorial (YouTube)', url: 'https://www.youtube.com/watch?v=phWxA89Dy94', type: 'Video', duration: '1h' },
    ],
    tips: [
      'Use CSS variables for reusable values (--primary-color).',
      'Avoid !important; use specificity instead.',
    ],
    codeSnippets: [
      {
        title: 'Flexbox Navigation',
        code: `.nav {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}`,
      },
    ],
  };

  const jsContent = {
    overview: {
      title: 'JavaScript: Interactivity Powerhouse',
      description: 'JavaScript brings websites to life with dynamic behavior, from form validation to real-time updates.',
      keyPoints: [
        'Manipulates the DOM for dynamic content.',
        'Handles events like clicks and inputs.',
        'Works with APIs for data fetching.',
        'Libraries like React enhance UI development.',
      ],
    },
    roadmap: [
      {
        stage: 'Beginner',
        title: 'Learn JavaScript Basics',
        description: 'Understand variables, functions, and basic syntax.',
        tasks: [
          'Declare variables with let, const.',
          'Write functions with parameters.',
          'Use console.log for debugging.',
        ],
        resources: [
          { title: 'MDN JavaScript Basics', url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics' },
        ],
      },
    ],
    tutorials: [
      { title: 'JavaScript for Beginners (YouTube)', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', type: 'Video', duration: '3h' },
    ],
    tips: [
      'Use strict mode ("use strict") to catch errors.',
      'Avoid global variables; use let/const.',
    ],
    codeSnippets: [
      {
        title: 'Event Listener',
        code: `const button = document.querySelector('#myButton');
button.addEventListener('click', () => {
  alert('Button clicked!');
});`,
      },
    ],
  };

  const toolsContent = {
    overview: {
      title: 'Tools & Frameworks: Build Like a Pro',
      description: 'Tools and frameworks streamline web development, from coding to deployment.',
      keyPoints: [
        'Editors like VS Code boost productivity.',
        'Version control (Git) tracks changes.',
        'Frameworks like React simplify UI development.',
        'Build tools like Vite optimize performance.',
      ],
    },
    roadmap: [
      {
        stage: 'Beginner',
        title: 'Set Up Your Environment',
        description: 'Install essential tools for coding.',
        tasks: [
          'Install VS Code and extensions (Prettier, ESLint).',
          'Set up Git and create a GitHub repo.',
          'Install Node.js for JavaScript projects.',
        ],
        resources: [
          { title: 'VS Code Setup', url: 'https://code.visualstudio.com/docs/setup/setup-overview' },
        ],
      },
    ],
    tutorials: [
      { title: 'Git for Beginners (YouTube)', url: 'https://www.youtube.com/watch?v=8JJ101D3knE', type: 'Video', duration: '1h' },
    ],
    tips: [
      'Use VS Code shortcuts (Ctrl+D, Alt+Click) to code faster.',
      'Commit often with clear messages in Git.',
    ],
    codeSnippets: [
      {
        title: 'Basic Vite Config',
        code: `import { defineConfig } from 'vite';
export default defineConfig({});`,
      },
    ],
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setPaidMentors(userDoc.data().paidMentors || []);
        }

        try {
          setLoadingMentors(true);
          const usersSnapshot = await getDocs(collection(db, 'users'));
          const mentorList = usersSnapshot.docs
            .filter(doc => doc.data().role === 'mentor')
            .map(doc => ({
              id: doc.id,
              name: doc.data().name || 'Unnamed Mentor',
              skill: Array.isArray(doc.data().skills) ? doc.data().skills.join(', ') : doc.data().skill || 'General',
              price: doc.data().price || 500,
              rating: doc.data().rating || 0,
            }));
          setMentors(mentorList);

          const reviewsData = {};
          for (const mentor of mentorList) {
            const reviewsSnapshot = await getDocs(collection(db, 'users', mentor.id, 'reviews'));
            reviewsData[mentor.id] = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
          setReviews(reviewsData);
          setMentorError(null);
        } catch (error) {
          console.error('Error fetching mentors:', error);
          setMentorError('Failed to load mentors. Please log in or try again later.');
          setMentors([]);
        } finally {
          setLoadingMentors(false);
        }
      } else {
        setMentorError('Please log in to view mentors.');
        setMentors([]);
        setLoadingMentors(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleShowQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    setRandomQuestions(shuffled.slice(0, 5));
    setQuizAnswers({});
    setQuizSubmitted(false);
    setScore(null);
    setShowQuiz(!showQuiz);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowQuiz(false);
    setExpandedSection(null);
  };

  const handleQuizAnswer = (questionId, option) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let correct = 0;
    randomQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setQuizSubmitted(true);
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEnroll = async (mentorId) => {
    if (!user) {
      toast.error('Please log in to enroll');
      navigate('/login');
      return;
    }
    const userRef = doc(db, 'users', user.uid);
    const updatedPaidMentors = [...paidMentors, mentorId];
    await updateDoc(userRef, { paidMentors: updatedPaidMentors });
    setPaidMentors(updatedPaidMentors);
    toast.success(`Enrolled with ${mentors.find(m => m.id === mentorId).name}!`);
  };

  const canChat = (mentorId) => paidMentors.includes(mentorId);

  const handleReviewSubmit = async (mentorId) => {
    if (!user) {
      toast.error('Please log in to submit a review');
      navigate('/login');
      return;
    }
    if (!newReview[mentorId]) {
      toast.error('Please enter a review');
      return;
    }

    const reviewData = {
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      review: newReview[mentorId],
      timestamp: new Date().toISOString(),
    };

    await addDoc(collection(db, 'users', mentorId, 'reviews'), reviewData);
    setReviews((prev) => ({
      ...prev,
      [mentorId]: [...(prev[mentorId] || []), reviewData],
    }));
    setNewReview((prev) => ({ ...prev, [mentorId]: '' }));
    toast.success('Review submitted!');
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-2 sm:px-4 py-6 sm:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 sm:mb-8 text-center">
          Website Development Hub
        </h1>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex space-x-3 bg-white rounded-full shadow-md p-2">
            <button
              onClick={() => handleTabChange('free')}
              className={`flex items-center space-x-1 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-colors ${
                activeTab === 'free'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-blue-100'
              }`}
            >
              <BookOpen className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Free Resources</span>
            </button>
            <button
              onClick={() => handleTabChange('paid')}
              className={`flex items-center space-x-1 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-colors ${
                activeTab === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-green-100'
              }`}
            >
              <DollarSign className="w-4 sm:w-5 h-4 sm:h-5" />
              <span>Paid Courses</span>
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6"
        >
          {activeTab === 'free' ? (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <Code className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                <span>Learn Web Development</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Master web development with our comprehensive resources, roadmaps, tutorials, and quizzes.
              </p>

              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('html')}
                >
                  <FileCode className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  <span>HTML: The Foundation</span>
                  {expandedSection === 'html' ? <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" /> : <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'html' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">{htmlContent.overview.title}</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{htmlContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {htmlContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>HTML Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-3 sm:gap-4 mt-2">
                          {htmlContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-sm sm:text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.resources.map((res, i) => (
                                  <li key={i}>
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {res.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                          {htmlContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium text-sm sm:text-base">{tutorial.title}</p>
                              <p className="text-gray-600 text-xs sm:text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm sm:text-base">
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {htmlContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-3 sm:space-y-4 mt-2">
                          {htmlContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-3 sm:p-4 rounded-md">
                              <p className="font-medium text-gray-300 text-sm sm:text-base">{snippet.title}</p>
                              <pre className="text-xs sm:text-sm overflow-x-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('css')}
                >
                  <Palette className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  <span>CSS: Styling the Web</span>
                  {expandedSection === 'css' ? <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" /> : <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'css' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">{cssContent.overview.title}</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{cssContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {cssContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>CSS Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-3 sm:gap-4 mt-2">
                          {cssContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-sm sm:text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.resources.map((res, i) => (
                                  <li key={i}>
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {res.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                          {cssContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium text-sm sm:text-base">{tutorial.title}</p>
                              <p className="text-gray-600 text-xs sm:text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm sm:text-base">
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {cssContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-3 sm:space-y-4 mt-2">
                          {cssContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-3 sm:p-4 rounded-md">
                              <p className="font-medium text-gray-300 text-sm sm:text-base">{snippet.title}</p>
                              <pre className="text-xs sm:text-sm overflow-x-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('js')}
                >
                  <Braces className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  <span>JavaScript: Interactivity</span>
                  {expandedSection === 'js' ? <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" /> : <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'js' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">{jsContent.overview.title}</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{jsContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {jsContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>JavaScript Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-3 sm:gap-4 mt-2">
                          {jsContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-sm sm:text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.resources.map((res, i) => (
                                  <li key={i}>
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {res.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                          {jsContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium text-sm sm:text-base">{tutorial.title}</p>
                              <p className="text-gray-600 text-xs sm:text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm sm:text-base">
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {jsContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-3 sm:space-y-4 mt-2">
                          {jsContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-3 sm:p-4 rounded-md">
                              <p className="font-medium text-gray-300 text-sm sm:text-base">{snippet.title}</p>
                              <pre className="text-xs sm:text-sm overflow-x-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('tools')}
                >
                  <Wrench className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  <span>Tools & Frameworks</span>
                  {expandedSection === 'tools' ? <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" /> : <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'tools' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">{toolsContent.overview.title}</h4>
                        <p className="text-gray-600 text-sm sm:text-base">{toolsContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {toolsContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>Tools Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-3 sm:gap-4 mt-2">
                          {toolsContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-sm sm:text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                                {step.resources.map((res, i) => (
                                  <li key={i}>
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                      {res.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2">
                          {toolsContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-2 sm:p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium text-sm sm:text-base">{tutorial.title}</p>
                              <p className="text-gray-600 text-xs sm:text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a href={tutorial.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm sm:text-base">
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2 text-sm sm:text-base">
                          {toolsContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-3 sm:space-y-4 mt-2">
                          {toolsContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-3 sm:p-4 rounded-md">
                              <p className="font-medium text-gray-300 text-sm sm:text-base">{snippet.title}</p>
                              <pre className="text-xs sm:text-sm overflow-x-auto">
                                <code>{snippet.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <h3
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('projects')}
                >
                  <Code className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                  <span>Project Ideas</span>
                  {expandedSection === 'projects' ? <ChevronUp className="w-4 sm:w-5 h-4 sm:h-5" /> : <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'projects' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 sm:space-y-6 overflow-hidden"
                    >
                      <ul className="list-disc list-inside text-gray-600 space-y-2 text-sm sm:text-base">
                        <li><strong>Portfolio Website</strong>: Showcase skills with HTML, CSS, React.</li>
                        <li><strong>Todo App</strong>: Interactive app with JavaScript, Firebase.</li>
                        <li><strong>Blog</strong>: Multi-page site with React Router, Tailwind.</li>
                        <li><strong>E-commerce Page</strong>: Responsive design, APIs.</li>
                        <li><strong>Weather App</strong>: Fetch data from a weather API.</li>
                        <li><strong>Quiz App</strong>: Build a mini-quiz like this page!</li>
                        <li><strong>Chat App</strong>: Real-time messaging with Firebase.</li>
                      </ul>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Push projects to GitHub to share with the community.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="text-center">
                <button
                  onClick={handleShowQuiz}
                  className="flex items-center justify-center mx-auto space-x-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:bg-blue-700 transition text-sm sm:text-base"
                >
                  <Brain className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span>Test Your Knowledge</span>
                </button>
              </div>

              <AnimatePresence>
                {showQuiz && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 sm:mt-6 space-y-4"
                  >
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Web Development Quiz</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Test your skills with 5 random questions.</p>
                    <form onSubmit={handleQuizSubmit} className="space-y-4">
                      {randomQuestions.map((q) => (
                        <div key={q.id} className="space-y-2">
                          <p className="text-gray-800 text-sm sm:text-base">{q.question}</p>
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
                              <span className="text-gray-700 text-sm sm:text-base">{option}</span>
                              {quizSubmitted && quizAnswers[q.id] === option[0] && (
                                quizAnswers[q.id] === q.correctAnswer ? (
                                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-500" />
                                )
                              )}
                            </label>
                          ))}
                        </div>
                      ))}
                      <div className="flex justify-end space-x-3 sm:space-x-4">
                        <button
                          type="submit"
                          disabled={quizSubmitted || Object.keys(quizAnswers).length < randomQuestions.length}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition text-sm sm:text-base"
                        >
                          {quizSubmitted ? 'Submitted' : 'Submit Quiz'}
                        </button>
                      </div>
                    </form>
                    {quizSubmitted && (
                      <div className="p-3 sm:p-4 bg-blue-50 rounded-md">
                        <p className="text-gray-800 font-medium text-sm sm:text-base">Your Score: {score}/5</p>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {score === 5 ? 'Perfect! You’re a pro!' : score >= 3 ? 'Good job! Review mistakes.' : 'Keep learning!'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <DollarSign className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
                <span>Paid Mentorship Programs</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Connect with experienced mentors for personalized guidance.
              </p>
              {loadingMentors ? (
                <p className="text-gray-600 text-center text-sm sm:text-base">Loading mentors...</p>
              ) : mentorError ? (
                <p className="text-red-500 text-center text-sm sm:text-base">{mentorError}</p>
              ) : mentors.length === 0 ? (
                <p className="text-gray-600 text-center text-sm sm:text-base">No mentors available at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {mentors.map((mentor) => (
                    <motion.div
                      key={mentor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200 shadow-sm hover:shadow-md transition"
                    >
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 text-center">
                        {mentor.name}
                      </h3>
                      <p className="text-gray-600 text-center text-xs sm:text-sm">Skill: {mentor.skill}</p>
                      <p className="text-gray-600 text-center text-xs sm:text-sm">Price:  ₹{mentor.price}/hr</p>
                      <div className="flex items-center justify-center space-x-1 mt-1 sm:mt-2">
                        <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-700 text-xs sm:text-sm">{mentor.rating.toFixed(1)}/5</span>
                      </div>
                      <div className="mt-2 flex flex-col space-y-1 sm:space-y-2">
                        <button
                          onClick={() => handleEnroll(mentor.id)}
                          disabled={paidMentors.includes(mentor.id)}
                          className="bg-green-600 text-white px-3 sm:px-4 py-1 rounded-full hover:bg-green-700 disabled:bg-gray-400 transition text-xs sm:text-sm"
                        >
                          {paidMentors.includes(mentor.id) ? 'Enrolled' : 'Enroll Now'}
                        </button>
                        <button
                          onClick={() => canChat(mentor.id) ? navigate(`/chat/${mentor.id}`) : null}
                          disabled={!canChat(mentor.id)}
                          className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition text-xs sm:text-sm"
                        >
                          {canChat(mentor.id) ? 'Chat Now' : 'Enroll to Chat'}
                        </button>
                      </div>
                      <div className="mt-2 sm:mt-3">
                        <h4 className="text-sm sm:text-md font-semibold text-gray-800">Reviews</h4>
                        {reviews[mentor.id] && reviews[mentor.id].length > 0 ? (
                          <ul className="space-y-1 mt-1 sm:mt-2">
                            {reviews[mentor.id].slice(0, 2).map((review) => (
                              <li key={review.id} className="text-gray-600 text-xs sm:text-sm">
                                {review.userName}: {review.review}
                              </li>
                            ))}
                            {reviews[mentor.id].length > 2 && (
                              <button
                                onClick={() => alert(reviews[mentor.id].map(r => `${r.userName}: ${r.review}`).join('\n'))}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                See all {reviews[mentor.id].length} reviews
                              </button>
                            )}
                          </ul>
                        ) : (
                          <p className="text-gray-600 text-xs sm:text-sm">No reviews yet.</p>
                        )}
                        <textarea
                          value={newReview[mentor.id] || ''}
                          onChange={(e) => setNewReview({ ...newReview, [mentor.id]: e.target.value })}
                          placeholder="Write a review..."
                          className="w-full mt-1 sm:mt-2 p-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                        />
                        <button
                          onClick={() => handleReviewSubmit(mentor.id)}
                          className="mt-1 sm:mt-2 bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full hover:bg-blue-700 text-xs sm:text-sm"
                        >
                          Submit Review
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Website;