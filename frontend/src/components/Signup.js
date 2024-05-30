import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const [inputError, setInputError] = useState({ username: false, fullName: false, email: false, password: false, confirmPassword: false });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setInputError({ username: false, fullName: false, email: false, password: false, confirmPassword: false });

    if (username.trim() === '' || fullName.trim() === '' || email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setAlert({ type: 'error', message: 'Please fill in all fields.', show: true });
      setInputError({
        username: username.trim() === '',
        fullName: fullName.trim() === '',
        email: email.trim() === '',
        password: password.trim() === '',
        confirmPassword: confirmPassword.trim() === ''
      });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match.', show: true });
      setInputError({ password: true, confirmPassword: true });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/signup/', {
        username,
        full_name: fullName,
        email,
        password,
      });
      setAlert({ type: 'success', message: 'Sign up successful! Redirecting to login...', show: true });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400 && error.response.data.username) {
        setAlert({ type: 'error', message: 'Username already exists. Do you want to login instead?', show: true });
        setInputError({ username: true });
      } else {
        setAlert({ type: 'error', message: 'An error occurred. Please try again.', show: true });
      }
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {alert.show && (
        <CSSTransition in={alert.show} timeout={300} classNames="alert" unmountOnExit>
          <div className={`fixed top-4 z-50 p-4 rounded shadow-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {alert.message}
            {alert.message.includes('login instead') && (
              <button onClick={() => navigate('/login')} className="underline ml-2">
                Login here
              </button>
            )}
          </div>
        </CSSTransition>
      )}
      <form onSubmit={handleSignup} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-left">Create an account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`mb-4 p-2 w-full border ${inputError.username ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`mb-4 p-2 w-full border ${inputError.fullName ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`mb-4 p-2 w-full border ${inputError.email ? 'border-red-500' : 'border-gray-300'} rounded`}
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`p-2 w-full border ${inputError.password ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`p-2 w-full border ${inputError.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded`}
          />
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center px-3 focus:outline-none"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white p-2 w-full rounded">Sign Up</button>
        <div className="text-sm text-left mt-4">
          <span>Already have an account? </span>
          <button onClick={() => navigate('/login')} className="text-sm text-blue-500 hover:text-blue-400 font-semibold">
            Login here
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;