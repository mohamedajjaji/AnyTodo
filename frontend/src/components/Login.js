import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const [inputError, setInputError] = useState({ username: false, password: false });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setInputError({ username: false, password: false });

    if (username.trim() === '' || password.trim() === '') {
      setAlert({ type: 'error', message: 'Please fill in both username and password.', show: true });
      setInputError({ username: username.trim() === '', password: password.trim() === '' });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.access);

      const profileResponse = await axios.get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });

      if (profileResponse.data.profile_picture) {
        const profilePictureUrl = `http://localhost:8000${profileResponse.data.profile_picture}`;
        localStorage.setItem('profilePicture', profilePictureUrl);
      }

      setAlert({ type: 'success', message: 'Login successful! Redirecting...', show: true });
      setTimeout(() => {
        setAlert({ ...alert, show: false });
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        if (error.response.data.detail === 'No active account found with the given credentials') {
          setAlert({ type: 'error', message: 'Incorrect username or password. Please try again.', show: true });
          setInputError({ username: true, password: true });
        } else if (error.response.data.detail === 'Incorrect password') {
          setAlert({ type: 'error', message: 'Incorrect password. Please try again.', show: true });
          setInputError({ username: false, password: true });
        }
      } else if (error.response && error.response.status === 404) {
        setAlert({ type: 'error', message: 'Username not found. Would you like to sign up?', show: true });
        setInputError({ username: true, password: false });
      } else {
        setAlert({ type: 'error', message: 'An error occurred. Please try again later.', show: true });
      }
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {alert.show && (
        <CSSTransition in={alert.show} timeout={300} classNames="alert" unmountOnExit>
          <div className={`fixed top-4 z-50 p-4 rounded shadow-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {alert.message}
            {alert.message.includes('sign up') && (
              <Link to="/signup" className="underline ml-2">Sign up</Link>
            )}
          </div>
        </CSSTransition>
      )}
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-left">Sign in to your account</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`mb-4 p-2 w-full border ${inputError.username ? 'border-red-500' : 'border-gray-300'} rounded`}
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
        <button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white p-2 w-full rounded">Sign in</button>
        <div className="text-sm text-left mt-4">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-sm text-blue-500 hover:text-blue-400 font-semibold">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;