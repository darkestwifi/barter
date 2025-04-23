const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, writeBatch } = require('firebase/firestore');
require('dotenv').config({ path: './.env' }); // Load .env

// Firebase config
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 20 questions for testing (expand to 200)
const questions = [
  {
    question: 'What is a controlled component in React?',
    options: [
      'A) Component with its own state',
      'B) Component whose state is controlled by the parent via props',
      'C) Component using useEffect',
      'D) Component with no props',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What does useState return?',
    options: [
      'A) A state variable and an update function',
      'B) A component and a hook',
      'C) A promise and a callback',
      'D) A ref and a state',
    ],
    correctAnswer: 'A',
    skill: 'React',
  },
  {
    question: 'What is the purpose of React.memo?',
    options: [
      'A) To memoize state',
      'B) To prevent unnecessary re-renders of components',
      'C) To manage side effects',
      'D) To create custom hooks',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'How do you handle asynchronous operations in Redux?',
    options: [
      'A) Using useEffect',
      'B) Using thunks or sagas',
      'C) Using useState',
      'D) Using React Context',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is a SyntheticEvent in React?',
    options: [
      'A) A browser-native event',
      'B) A cross-browser wrapper around native events',
      'C) A custom event created by useState',
      'D) An event for form validation',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is useEffect used for?',
    options: [
      'A) State management',
      'B) Side effects',
      'C) Routing',
      'D) Memoization',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is the purpose of useCallback?',
    options: [
      'A) To manage state',
      'B) To memoize functions',
      'C) To handle side effects',
      'D) To create components',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What does JSX stand for?',
    options: [
      'A) JavaScript XML',
      'B) JavaScript Extension',
      'C) Java Syntax',
      'D) JavaScript X',
    ],
    correctAnswer: 'A',
    skill: 'React',
  },
  {
    question: 'What is the virtual DOM?',
    options: [
      'A) A real DOM in memory',
      'B) A lightweight copy of the DOM',
      'C) A database for components',
      'D) A CSS framework',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is a React fragment?',
    options: [
      'A) A component with state',
      'B) A wrapper for multiple elements without a parent node',
      'C) A hook for effects',
      'D) A routing component',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is the purpose of useReducer?',
    options: [
      'A) To manage complex state logic',
      'B) To memoize values',
      'C) To handle side effects',
      'D) To create refs',
    ],
    correctAnswer: 'A',
    skill: 'React',
  },
  {
    question: 'What is React Router used for?',
    options: [
      'A) State management',
      'B) Client-side routing',
      'C) API calls',
      'D) Styling components',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is the Context API?',
    options: [
      'A) A state management library',
      'B) A way to share data without prop drilling',
      'C) A routing library',
      'D) A testing framework',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is a higher-order component?',
    options: [
      'A) A component with state',
      'B) A function that takes a component and returns a new component',
      'C) A hook for effects',
      'D) A component with props',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is the purpose of useMemo?',
    options: [
      'A) To manage state',
      'B) To memoize expensive computations',
      'C) To handle side effects',
      'D) To create refs',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is lazy loading in React?',
    options: [
      'A) Loading all components at once',
      'B) Loading components on demand',
      'C) Loading state from a server',
      'D) Loading CSS files',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is the purpose of Suspense?',
    options: [
      'A) To handle state',
      'B) To manage asynchronous rendering',
      'C) To memoize functions',
      'D) To create routes',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is an error boundary?',
    options: [
      'A) A component that catches JavaScript errors',
      'B) A hook for state',
      'C) A routing component',
      'D) A CSS class',
    ],
    correctAnswer: 'A',
    skill: 'React',
  },
  {
    question: 'What is the use of useRef?',
    options: [
      'A) To manage state',
      'B) To persist values across renders',
      'C) To handle side effects',
      'D) To memoize values',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  {
    question: 'What is the purpose of PropTypes?',
    options: [
      'A) To style components',
      'B) To validate props',
      'C) To manage state',
      'D) To handle routing',
    ],
    correctAnswer: 'B',
    skill: 'React',
  },
  // Add 180 more questions
];

// Batch upload questions
async function addQuestions() {
  try {
    const batch = writeBatch(db);
    questions.forEach((question) => {
      const docRef = doc(collection(db, 'questions'));
      batch.set(docRef, question);
    });
    await batch.commit();
    console.log(`Added ${questions.length} questions successfully!`);
  } catch (error) {
    console.error('Error adding questions:', error);
  }
}

addQuestions();