import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to AnyTodo</h1>
        <p className="text-lg mb-8">The best place to efficiently manage your tasks.<br/>Unlock your productivity with AnyTodo!</p>
        <Link to="/login" className="bg-blue-500 text-white p-2 rounded mx-2">Login</Link>
        <Link to="/signup" className="bg-green-500 text-white p-2 rounded mx-2">Sign Up</Link>
      </div>
    </div>
  );
};

export default LandingPage;