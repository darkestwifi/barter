import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, BookOpen, DollarSign, CheckCircle, XCircle, Brain, ChevronDown, ChevronUp, PlayCircle, Map, FileCode, Palette, Braces, Wrench } from 'lucide-react';

const Website = () => {
  const [activeTab, setActiveTab] = useState('free');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  // Quiz question bank (30 questions, balanced across HTML, CSS, JS, tools)
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

  // HTML Section Data
  const htmlContent = {
    overview: {
      title: 'HTML: The Foundation of the Web',
      description: 'HTML (HyperText Markup Language) is the backbone of every website, defining its structure and content. From simple text to complex forms, HTML organizes elements like headings, paragraphs, images, links, and more to create accessible, semantic, and SEO-friendly pages.',
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
      {
        stage: 'Beginner',
        title: 'Semantic HTML',
        description: 'Use semantic tags for meaning and accessibility.',
        tasks: [
          'Use <header>, <nav>, <main>, <footer>.',
          'Add ARIA roles for screen readers.',
          'Validate HTML with W3C Validator.',
        ],
        resources: [
          { title: 'MDN Semantic HTML', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantics_in_html' },
          { title: 'freeCodeCamp Semantic HTML', url: 'https://www.freecodecamp.org/news/semantic-html5-elements/' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Forms and Inputs',
        description: 'Build interactive forms for user input.',
        tasks: [
          'Create a login form with <form>, <input>, <button>.',
          'Use input types: text, email, password, checkbox.',
          'Add validation with required and pattern.',
        ],
        resources: [
          { title: 'MDN HTML Forms', url: 'https://developer.mozilla.org/en-US/docs/Learn/Forms' },
          { title: 'W3Schools HTML Forms', url: 'https://www.w3schools.com/html/html_forms.asp' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'HTML5 Features',
        description: 'Explore modern HTML5 elements and APIs.',
        tasks: [
          'Embed videos with <video>, audio with <audio>.',
          'Use <canvas> for graphics.',
          'Try Geolocation API (with JS).',
        ],
        resources: [
          { title: 'MDN HTML5', url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5' },
          { title: 'HTML5 Rocks', url: 'https://www.html5rocks.com/' },
        ],
      },
      {
        stage: 'Advanced',
        title: 'SEO and Accessibility',
        description: 'Optimize HTML for search engines and accessibility.',
        tasks: [
          'Add meta tags for description, keywords.',
          'Use alt text, ARIA landmarks.',
          'Test with WAVE or Lighthouse.',
        ],
        resources: [
          { title: 'Moz SEO Guide', url: 'https://moz.com/learn/seo' },
          { title: 'WebAIM Accessibility', url: 'https://webaim.org/techniques/' },
        ],
      },
    ],
    tutorials: [
      { title: 'HTML in 1 Hour (YouTube)', url: 'https://www.youtube.com/watch?v=ok-plXXHlWw', type: 'Video', duration: '1h' },
      { title: 'freeCodeCamp HTML Course', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Course', duration: '4h' },
      { title: 'W3Schools HTML Exercises', url: 'https://www.w3schools.com/html/html_exercises.asp', type: 'Interactive', duration: '30m' },
      { title: 'MDN HTML Reference', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element', type: 'Article', duration: 'Varies' },
    ],
    tips: [
      'Use semantic tags (<article>, <section>) over <div>.',
      'Always include alt text for images.',
      'Validate HTML (https://validator.w3.org/).',
      'Use <meta charset="UTF-8"> for special characters.',
      'Avoid inline CSS; use external files.',
      'Test forms on multiple devices.',
      'Use comments (<!-- -->) to organize code.',
    ],
    codeSnippets: [
      {
        title: 'Basic HTML Structure',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>Hello, world!</p>
  </main>
</body>
</html>`,
      },
      {
        title: 'Semantic Form',
        code: `<form action="/submit" method="POST">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Submit</button>
</form>`,
      },
    ],
  };

  // CSS Section Data
  const cssContent = {
    overview: {
      title: 'CSS: Styling the Web',
      description: 'CSS (Cascading Style Sheets) transforms HTML into visually stunning websites with layouts, colors, fonts, and animations. It enables responsive designs and modern layouts like Flexbox and Grid.',
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
          { title: 'W3Schools CSS Tutorial', url: 'https://www.w3schools.com/css/' },
        ],
      },
      {
        stage: 'Beginner',
        title: 'Box Model & Positioning',
        description: 'Understand the CSS box model and element positioning.',
        tasks: [
          'Experiment with margin, padding, border, width.',
          'Use position: relative, absolute, fixed.',
          'Center elements with margin: auto.',
        ],
        resources: [
          { title: 'MDN CSS Box Model', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model' },
          { title: 'CSS Tricks Box Model', url: 'https://css-tricks.com/the-css-box-model/' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Flexbox & Grid',
        description: 'Create modern, responsive layouts.',
        tasks: [
          'Build a navigation bar with Flexbox.',
          'Create a photo gallery with Grid.',
          'Use justify-content and align-items.',
        ],
        resources: [
          { title: 'MDN Flexbox', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout' },
          { title: 'CSS Grid Garden', url: 'https://cssgridgarden.com/' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Responsive Design',
        description: 'Make websites adapt to all devices.',
        tasks: [
          'Write media queries for mobile and desktop.',
          'Use relative units (%, vw, rem, em).',
          'Test responsiveness with browser dev tools.',
        ],
        resources: [
          { title: 'MDN Responsive Design', url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design' },
          { title: 'freeCodeCamp Responsive Web', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/' },
        ],
      },
      {
        stage: 'Advanced',
        title: 'Animations & Frameworks',
        description: 'Add animations and use CSS frameworks.',
        tasks: [
          'Create transitions with transition property.',
          'Animate elements with @keyframes.',
          'Build a page with Tailwind CSS.',
        ],
        resources: [
          { title: 'MDN CSS Animations', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations' },
          { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs' },
        ],
      },
    ],
    tutorials: [
      { title: 'CSS Flexbox Tutorial (YouTube)', url: 'https://www.youtube.com/watch?v=phWxA89Dy94', type: 'Video', duration: '1h' },
      { title: 'freeCodeCamp CSS Course', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', type: 'Course', duration: '4h' },
      { title: 'W3Schools CSS Exercises', url: 'https://www.w3schools.com/css/css_exercises.asp', type: 'Interactive', duration: '30m' },
      { title: 'CSS Tricks Guide', url: 'https://css-tricks.com/guides/', type: 'Article', duration: 'Varies' },
    ],
    tips: [
      'Use CSS variables for reusable values (--primary-color).',
      'Avoid !important; use specificity instead.',
      'Test cross-browser compatibility (Chrome, Firefox, Safari).',
      'Minify CSS for production to reduce file size.',
      'Use shorthand properties (e.g., margin: 10px 20px).',
      'Leverage dev tools to debug layouts.',
      'Keep selectors simple to improve performance.',
    ],
    codeSnippets: [
      {
        title: 'Flexbox Navigation',
        code: `.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}
.nav-item {
  margin: 0 15px;
}`,
      },
      {
        title: 'Responsive Grid',
        code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}
@media (max-width: 600px) {
  .gallery {
    grid-template-columns: 1fr;
  }
}`,
      },
    ],
  };

  // JavaScript Section Data
  const jsContent = {
    overview: {
      title: 'JavaScript: Interactivity Powerhouse',
      description: 'JavaScript brings websites to life with dynamic behavior, from form validation to real-time updates. It manipulates the DOM, handles events, and fetches data from APIs.',
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
          { title: 'W3Schools JavaScript Tutorial', url: 'https://www.w3schools.com/js/' },
        ],
      },
      {
        stage: 'Beginner',
        title: 'DOM Manipulation',
        description: 'Interact with HTML elements dynamically.',
        tasks: [
          'Select elements with querySelector.',
          'Change text with innerText.',
          'Add event listeners for clicks.',
        ],
        resources: [
          { title: 'MDN DOM', url: 'https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model' },
          { title: 'JavaScript.info DOM', url: 'https://javascript.info/dom-nodes' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Arrays & Objects',
        description: 'Work with complex data structures.',
        tasks: [
          'Use array methods: map, filter, reduce.',
          'Create and access object properties.',
          'Loop through arrays with forEach.',
        ],
        resources: [
          { title: 'MDN Arrays', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array' },
          { title: 'freeCodeCamp JavaScript', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Asynchronous JavaScript',
        description: 'Handle asynchronous operations like API calls.',
        tasks: [
          'Use Promises with .then/.catch.',
          'Write async/await functions.',
          'Fetch data from a public API.',
        ],
        resources: [
          { title: 'MDN Async JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous' },
          { title: 'JavaScript.info Async', url: 'https://javascript.info/async' },
        ],
      },
      {
        stage: 'Advanced',
        title: 'Frameworks & Libraries',
        description: 'Build apps with modern JavaScript frameworks.',
        tasks: [
          'Create a React component.',
          'Manage state with useState.',
          'Build a small app with React Router.',
        ],
        resources: [
          { title: 'React Docs', url: 'https://react.dev/' },
          { title: 'Scrimba React Course', url: 'https://scrimba.com/learn/learnreact' },
        ],
      },
    ],
    tutorials: [
      { title: 'JavaScript for Beginners (YouTube)', url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', type: 'Video', duration: '3h' },
      { title: 'freeCodeCamp JavaScript Course', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/', type: 'Course', duration: '6h' },
      { title: 'W3Schools JavaScript Exercises', url: 'https://www.w3schools.com/js/js_exercises.asp', type: 'Interactive', duration: '30m' },
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'Article', duration: 'Varies' },
    ],
    tips: [
      'Use strict mode ("use strict") to catch errors.',
      'Avoid global variables; use let/const.',
      'Debug with console.log and browser dev tools.',
      'Use arrow functions for concise code.',
      'Handle errors with try/catch in async code.',
      'Keep functions small and single-purpose.',
      'Use ESLint to enforce code quality.',
    ],
    codeSnippets: [
      {
        title: 'Event Listener',
        code: `const button = document.querySelector('#myButton');
button.addEventListener('click', () => {
  alert('Button clicked!');
});`,
      },
      {
        title: 'Fetch API Data',
        code: `async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}`,
      },
    ],
  };

  // Tools & Frameworks Section Data
  const toolsContent = {
    overview: {
      title: 'Tools & Frameworks: Build Like a Pro',
      description: 'Tools and frameworks streamline web development, from coding to deployment. Learn editors, version control, build tools, and frameworks to create modern, scalable websites.',
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
          { title: 'GitHub Getting Started', url: 'https://docs.github.com/en/get-started' },
        ],
      },
      {
        stage: 'Beginner',
        title: 'Learn Version Control',
        description: 'Master Git for collaboration and backups.',
        tasks: [
          'Create a repo and make commits.',
          'Use git push, pull, and branch.',
          'Resolve merge conflicts.',
        ],
        resources: [
          { title: 'Git Handbook', url: 'https://guides.github.com/introduction/git-handbook/' },
          { title: 'Atlassian Git Tutorial', url: 'https://www.atlassian.com/git/tutorials' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Build Tools & Package Managers',
        description: 'Use tools to manage and optimize projects.',
        tasks: [
          'Create a project with Vite.',
          'Install packages with npm or Yarn.',
          'Bundle assets with a build tool.',
        ],
        resources: [
          { title: 'Vite Docs', url: 'https://vitejs.dev/guide/' },
          { title: 'npm Docs', url: 'https://docs.npmjs.com/' },
        ],
      },
      {
        stage: 'Intermediate',
        title: 'Frontend Frameworks',
        description: 'Build UIs with modern frameworks.',
        tasks: [
          'Create a React app with Vite.',
          'Use Tailwind CSS for styling.',
          'Explore Vue.js or Angular basics.',
        ],
        resources: [
          { title: 'React Docs', url: 'https://react.dev/' },
          { title: 'Tailwind CSS Docs', url: 'https://tailwindcss.com/docs' },
        ],
      },
      {
        stage: 'Advanced',
        title: 'Backend & Deployment',
        description: 'Learn backend tools and deploy apps.',
        tasks: [
          'Build an API with Node.js and Express.',
          'Deploy a site to Vercel or Netlify.',
          'Use Firebase for authentication.',
        ],
        resources: [
          { title: 'Node.js Docs', url: 'https://nodejs.org/en/docs/' },
          { title: 'Firebase Docs', url: 'https://firebase.google.com/docs' },
        ],
      },
    ],
    tutorials: [
      { title: 'Git for Beginners (YouTube)', url: 'https://www.youtube.com/watch?v=8JJ101D3knE', type: 'Video', duration: '1h' },
      { title: 'freeCodeCamp React Course', url: 'https://www.freecodecamp.org/learn/2022/front-end-development-libraries/', type: 'Course', duration: '5h' },
      { title: 'Vite Getting Started', url: 'https://vitejs.dev/guide/', type: 'Article', duration: 'Varies' },
      { title: 'Firebase Authentication Tutorial', url: 'https://firebase.google.com/docs/auth/web/start', type: 'Article', duration: 'Varies' },
    ],
    tips: [
      'Use VS Code shortcuts (Ctrl+D, Alt+Click) to code faster.',
      'Commit often with clear messages in Git.',
      'Use .gitignore to exclude sensitive files.',
      'Test deployments in staging before production.',
      'Leverage browser dev tools for debugging.',
      'Keep package.json dependencies updated.',
      'Use linters (ESLint, Stylelint) for clean code.',
    ],
    codeSnippets: [
      {
        title: 'Basic Vite Config',
        code: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
      },
      {
        title: 'Simple Express API',
        code: `const express = require('express');
const app = express();
app.get('/api', (req, res) => {
  res.json({ message: 'Hello, world!' });
});
app.listen(3000, () => console.log('Server running'));`,
      },
    ],
  };

  // Sample Paid Courses
  const paidCourses = [
    { title: 'Full-Stack Web Dev', price: '$99', duration: '10 weeks', description: 'Learn React, Node.js, MongoDB.' },
    { title: 'Advanced HTML & CSS', price: '$59', duration: '4 weeks', description: 'Master responsive design, animations.' },
    { title: 'JavaScript Deep Dive', price: '$79', duration: '6 weeks', description: 'ES6, APIs, async programming.' },
    { title: 'React Pro', price: '$89', duration: '8 weeks', description: 'Hooks, context, performance.' },
    { title: 'Backend with Node.js', price: '$99', duration: '10 weeks', description: 'APIs, databases, deployment.' },
  ];

  // Select 5 random quiz questions
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

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-8 text-center">
          Website Development Hub
        </h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4 bg-white rounded-full shadow-md p-2">
            <button
              onClick={() => handleTabChange('free')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-base font-semibold transition-colors ${
                activeTab === 'free'
                  ? 'bg-blue-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-blue-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Free Resources</span>
            </button>
            <button
              onClick={() => handleTabChange('paid')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full text-base font-semibold transition-colors ${
                activeTab === 'paid'
                  ? 'bg-green-600 text-white'
                  : 'bg-transparent text-gray-600 hover:bg-green-100'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span>Paid Courses</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          {activeTab === 'free' ? (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
                <Code className="w-6 h-6 text-blue-600" />
                <span>Learn Web Development</span>
              </h2>
              <p className="text-gray-600">
                Master web development with our comprehensive resources, roadmaps, tutorials, and quizzes. Explore HTML, CSS, JavaScript, and essential tools to build modern websites.
              </p>

              {/* HTML Section */}
              <div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('html')}
                >
                  <FileCode className="w-6 h-6 text-blue-600" />
                  <span>HTML: The Foundation</span>
                  {expandedSection === 'html' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'html' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{htmlContent.overview.title}</h4>
                        <p className="text-gray-600">{htmlContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {htmlContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-5 h-5 text-blue-600" />
                          <span>HTML Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-4 mt-2">
                          {htmlContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600">{step.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Tasks:</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <p className="text-sm text-gray-600 mt-2">Resources:</p>
                              <ul className="list-disc list-inside text-gray-600">
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
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {htmlContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium">{tutorial.title}</p>
                              <p className="text-gray-600 text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a
                                href={tutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {htmlContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-4 mt-2">
                          {htmlContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-4 rounded-md">
                              <p className="font-medium text-gray-300">{snippet.title}</p>
                              <pre className="text-sm overflow-x-auto">
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

              {/* CSS Section */}
              <div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('css')}
                >
                  <Palette className="w-6 h-6 text-blue-600" />
                  <span>CSS: Styling the Web</span>
                  {expandedSection === 'css' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'css' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{cssContent.overview.title}</h4>
                        <p className="text-gray-600">{cssContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {cssContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-5 h-5 text-blue-600" />
                          <span>CSS Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-4 mt-2">
                          {cssContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600">{step.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Tasks:</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <p className="text-sm text-gray-600 mt-2">Resources:</p>
                              <ul className="list-disc list-inside text-gray-600">
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
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {cssContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium">{tutorial.title}</p>
                              <p className="text-gray-600 text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a
                                href={tutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {cssContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-4 mt-2">
                          {cssContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-4 rounded-md">
                              <p className="font-medium text-gray-300">{snippet.title}</p>
                              <pre className="text-sm overflow-x-auto">
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

              {/* JavaScript Section */}
              <div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('js')}
                >
                  <Braces className="w-6 h-6 text-blue-600" />
                  <span>JavaScript: Interactivity</span>
                  {expandedSection === 'js' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'js' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{jsContent.overview.title}</h4>
                        <p className="text-gray-600">{jsContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {jsContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-5 h-5 text-blue-600" />
                          <span>JavaScript Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-4 mt-2">
                          {jsContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600">{step.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Tasks:</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <p className="text-sm text-gray-600 mt-2">Resources:</p>
                              <ul className="list-disc list-inside text-gray-600">
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
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {jsContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium">{tutorial.title}</p>
                              <p className="text-gray-600 text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a
                                href={tutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {jsContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-4 mt-2">
                          {jsContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-4 rounded-md">
                              <p className="font-medium text-gray-300">{snippet.title}</p>
                              <pre className="text-sm overflow-x-auto">
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

              {/* Tools & Frameworks Section */}
              <div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('tools')}
                >
                  <Wrench className="w-6 h-6 text-blue-600" />
                  <span>Tools & Frameworks</span>
                  {expandedSection === 'tools' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'tools' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">{toolsContent.overview.title}</h4>
                        <p className="text-gray-600">{toolsContent.overview.description}</p>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {toolsContent.overview.keyPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <Map className="w-5 h-5 text-blue-600" />
                          <span>Tools Learning Roadmap</span>
                        </h4>
                        <div className="grid gap-4 mt-2">
                          {toolsContent.roadmap.map((step, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <h5 className="text-base font-semibold text-gray-800">{step.title} ({step.stage})</h5>
                              <p className="text-gray-600">{step.description}</p>
                              <p className="text-sm text-gray-600 mt-2">Tasks:</p>
                              <ul className="list-disc list-inside text-gray-600">
                                {step.tasks.map((task, i) => (
                                  <li key={i}>{task}</li>
                                ))}
                              </ul>
                              <p className="text-sm text-gray-600 mt-2">Resources:</p>
                              <ul className="list-disc list-inside text-gray-600">
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
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                          <PlayCircle className="w-5 h-5 text-blue-600" />
                          <span>Tutorials & Resources</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          {toolsContent.tutorials.map((tutorial, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-gray-800 font-medium">{tutorial.title}</p>
                              <p className="text-gray-600 text-sm">Type: {tutorial.type} | Duration: {tutorial.duration}</p>
                              <a
                                href={tutorial.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                Start Learning
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Tips & Tricks</h4>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                          {toolsContent.tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">Code Snippets</h4>
                        <div className="space-y-4 mt-2">
                          {toolsContent.codeSnippets.map((snippet, idx) => (
                            <div key={idx} className="bg-gray-800 text-white p-4 rounded-md">
                              <p className="font-medium text-gray-300">{snippet.title}</p>
                              <pre className="text-sm overflow-x-auto">
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

              {/* Project Ideas */}
              <div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2 cursor-pointer"
                  onClick={() => toggleSection('projects')}
                >
                  <Code className="w-6 h-6 text-blue-600" />
                  <span>Project Ideas</span>
                  {expandedSection === 'projects' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </h3>
                <AnimatePresence>
                  {expandedSection === 'projects' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 overflow-hidden"
                    >
                      <ul className="list-disc list-inside text-gray-600 space-y-2">
                        <li><strong>Portfolio Website</strong>: Showcase skills with HTML, CSS, React.</li>
                        <li><strong>Todo App</strong>: Interactive app with JavaScript, Firebase.</li>
                        <li><strong>Blog</strong>: Multi-page site with React Router, Tailwind.</li>
                        <li><strong>E-commerce Page</strong>: Responsive design, APIs.</li>
                        <li><strong>Weather App</strong>: Fetch data from a weather API.</li>
                        <li><strong>Quiz App</strong>: Build a mini-quiz like this page!</li>
                        <li><strong>Chat App</strong>: Real-time messaging with Firebase.</li>
                      </ul>
                      <p className="text-gray-600">
                        Push projects to GitHub (like your barter repo) to share with the community.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quiz Button */}
              <div className="text-center">
                <button
                  onClick={handleShowQuiz}
                  className="flex items-center justify-center mx-auto space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  <Brain className="w-5 h-5" />
                  <span>{showQuiz ? 'Hide Quiz' : 'Take the Web Dev Quiz'}</span>
                </button>
              </div>

              {/* Interactive Quiz */}
              {showQuiz && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Test Your Knowledge</h3>
                  <p className="text-gray-600 mb-4">
                    Answer these 5 random questions to test your skills in HTML, CSS, JavaScript, and tools.
                  </p>
                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    {randomQuestions.map((q) => (
                      <div key={q.id} className="space-y-2">
                        <p className="text-gray-800 font-medium">{q.question}</p>
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
                            <span className="text-gray-600">{option}</span>
                            {quizSubmitted && (
                              <>
                                {quizAnswers[q.id] === option[0] && quizAnswers[q.id] === q.correctAnswer && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                                {quizAnswers[q.id] === option[0] && quizAnswers[q.id] !== q.correctAnswer && (
                                  <XCircle className="w-5 h-5 text-red-500" />
                                )}
                              </>
                            )}
                          </label>
                        ))}
                      </div>
                    ))}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={quizSubmitted || Object.keys(quizAnswers).length < randomQuestions.length}
                        className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
                      >
                        {quizSubmitted ? 'Submitted' : 'Submit Quiz'}
                      </button>
                    </div>
                  </form>
                  {quizSubmitted && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-md">
                      <p className="text-gray-800 font-medium">
                        Your Score: {score} out of {randomQuestions.length}
                      </p>
                      <p className="text-gray-600">
                        {score === randomQuestions.length
                          ? 'Perfect! You’re a web dev pro!'
                          : score >= randomQuestions.length / 2
                          ? 'Nice work! Review incorrect answers to level up.'
                          : 'Keep learning! Check the resources above.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Premium Courses</h2>
              <p className="text-gray-600">
                Unlock advanced web development skills with our premium courses, designed for all levels.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paidCourses.map((course, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="text-lg font-semibold text-gray-800">{course.title}</h4>
                    <p className="text-gray-600">{course.description}</p>
                    <p className="text-gray-600">Price: {course.price}</p>
                    <p className="text-gray-600">Duration: {course.duration}</p>
                    <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700">
                      Enroll Now
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Website;