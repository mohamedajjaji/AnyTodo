import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

const LandingPage = () => {
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          <img src="/anytodo_logo.svg" alt="AnyTodo Logo" className="h-10 w-30 rounded-full"/>
          <nav>
            <button onClick={() => setShowAbout(true)} className="text-simbold text-gray-700 hover:text-gray-900 mr-2">About</button>
            <button onClick={() => setShowContact(true)} className="text-simbold text-gray-700 hover:text-gray-900 mr-2">Contact Us</button>
            <button 
              onClick={() => navigate('/login')} 
              className="bg-blue-500 hover:bg-blue-400 text-white text-simbold p-2 rounded-full shadow-lg w-24"
            >
              Login
            </button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Stay Ahead, Stay Organized </h1>
          <p className="text-lg text-simbold mb-8">The smartest way to plan, prioritize, and complete your tasks.<br />Unlock your potential with AnyTodo </p>
          <button 
            onClick={() => navigate('/signup')} 
            className="bg-sky-500 hover:bg-sky-400 text-simbold text-white p-2 rounded-full shadow-lg h-12 w-48"
          >
            Get Started -&gt;
          </button>
        </div>
      </main>

      <footer className="bg-white shadow-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span>&copy; 2024 - ANYTODO</span>
          <div className="flex space-x-4">
            <a href="https://github.com/mohamedajjaji" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 flex items-center">
              <FiGithub className="mr-2" /> GitHub
            </a>
            <a href="https://www.linkedin.com/in/mohamedajjaji/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 flex items-center">
              <FiLinkedin className="mr-2" /> LinkedIn
            </a>
          </div>
        </div>
      </footer>

      <CSSTransition in={showAbout} timeout={300} classNames="popup" unmountOnExit>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg text-center mb-4">About AnyTodo</h2>
            <p>AnyTodo is designed to help you manage your tasks efficiently and boost your productivity.</p>
            <button onClick={() => setShowAbout(false)} className="mt-4 bg-blue-500 text-white p-2 rounded">Close</button>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition in={showContact} timeout={300} classNames="popup" unmountOnExit>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg text-center mb-4">Contact Us</h2>
            <p>You can reach us at contact@anytodo.com.</p>
            <button onClick={() => setShowContact(false)} className="mt-4 bg-blue-500 text-white p-2 rounded">Close</button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
};

export default LandingPage;