import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { FiMoreVertical, FiLogOut, FiSun, FiCalendar, FiClipboard, FiList, FiUser, FiSearch, FiChevronDown, FiMenu, FiArrowLeft, FiBell, FiBellOff } from 'react-icons/fi';
import TaskDetails from './TaskDetails';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '', show: false });
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTaskId, setReminderTaskId] = useState(null);
  const refs = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUserProfile();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tasks/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(response.data);
      setFilteredTasks(response.data);
      const now = dayjs();
      const upcomingReminders = response.data.filter(task => task.remind_me && dayjs(task.due_date).isBefore(now));
      setNotifications(upcomingReminders);
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'Error fetching tasks.', show: true });
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFullName(response.data.full_name);
      setProfilePicture(localStorage.getItem('profilePicture'));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterTasks(e.target.value);
  };

  const filterTasks = (query) => {
    if (!query) {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.title.toLowerCase().includes(query.toLowerCase())));
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setAlert({ type: 'error', message: 'Task title cannot be empty.', show: true });
      return;
    }
    try {
      const currentDateTime = dayjs().format();
      const response = await axios.post(
        'http://localhost:8000/api/tasks/',
        { title: newTaskTitle, due_date: currentDateTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setFilteredTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setAlert({ type: 'success', message: 'Task added successfully.', show: true });
      setSelectedTaskId(response.data.id);
    } catch (error) {
      console.error('Error adding task:', error);
      setAlert({ type: 'error', message: 'Error adding task.', show: true });
    }
  };

  const handleEdit = (taskId, currentTitle) => {
    setEditTaskId(taskId);
    setEditTitle(currentTitle);
  };

  const handleEditSubmit = async () => {
    try {
      const currentDateTime = dayjs().format();
      await axios.patch(
        `http://localhost:8000/api/tasks/${editTaskId}/`,
        { title: editTitle, due_date: currentDateTime },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks(tasks.map(task => (task.id === editTaskId ? { ...task, title: editTitle } : task)));
      setFilteredTasks(filteredTasks.map(task => (task.id === editTaskId ? { ...task, title: editTitle } : task)));
      setEditTaskId(null);
      setEditTitle('');
      setAlert({ type: 'success', message: 'Task title updated successfully.', show: true });
      setSelectedTaskId(editTaskId);
    } catch (error) {
      console.error(`Error updating task with ID: ${editTaskId}`, error);
      setAlert({ type: 'error', message: 'Error updating task.', show: true });
    }
  };

  const handleRemindMe = (taskId) => {
    setReminderTaskId(taskId);
    setShowReminder(true);
  };

  const handleSetReminder  = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${reminderTaskId}/`,
        { remind_me: reminderDate },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks(tasks.map(task => (task.id === reminderTaskId ? { ...task, remind_me: reminderDate } : task)));
      setFilteredTasks(filteredTasks.map(task => (task.id === reminderTaskId ? { ...task, remind_me: reminderDate } : task)));
      setAlert({ type: 'success', message: 'Task reminder updated.', show: true });
      setShowReminder(false);
      setReminderDate(null);
      setReminderTaskId(null);
    } catch (error) {
      console.error(`Error updating task with ID: ${reminderTaskId}`, error);
      setAlert({ type: 'error', message: 'Error updating task reminder.', show: true });
    }
  };

  const handleNotificationClick = async (taskId) => {
    setSelectedTaskId(taskId);
    setNotifications(notifications.filter(task => task.id !== taskId));
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { remind_me: null },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error(`Error updating task with ID: ${taskId}`, error);
    }
  };

  const handleClickOutside = (event) => {
    if (refs.current && !refs.current.contains(event.target)) {
      setShowNotifications(false);
      setShowReminder(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setTasks(tasks.filter(task => task.id !== taskId));
      setFilteredTasks(filteredTasks.filter(task => task.id !== taskId));
      setAlert({ type: 'success', message: 'Task deleted successfully.', show: true });
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
    } catch (error) {
      console.error(`Error deleting task with ID: ${taskId}`, error);
      setAlert({ type: 'error', message: 'Error deleting task.', show: true });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const handleFilter = (filterType) => {
    let filtered = [];
    const today = dayjs().startOf('day');

    if (filterType === 'day') {
      filtered = tasks.filter(task => dayjs(task.due_date).isSame(today, 'day'));
    } else if (filterType === 'week') {
      const nextWeek = today.add(7, 'day');
      filtered = tasks.filter(task => dayjs(task.due_date).isBefore(nextWeek, 'day'));
    } else {
      filtered = tasks;
    }

    setFilteredTasks(filtered);
  };

  return (
    <div className="flex flex-col bg-gray-100 md:flex-row h-screen p-5 font-semibold md:overflow-hidden overflow-auto">
      {alert.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
          <button className="ml-4" onClick={() => setAlert({ ...alert, show: false })}>×</button>
        </div>
      )}
      <aside className={`fixed z-50 top-0 left-0 w-64 bg-white shadow-md transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <div className="px-8 py-4 flex justify-between items-center">
          <img src="/anytodo_logo.svg" alt="AnyTodo Logo" className="w-max mb-6 mt-6 mx-auto" />
          <button className="md:hidden" onClick={handleSidebarToggle}>
            <FiArrowLeft className="text-2xl" />
          </button>
        </div>
        <nav className="flex-1 px-4 h-screen overflow-y-auto">
          <ul>
            <li>
              <button onClick={() => handleFilter('day')} className="flex items-center rounded-md shadow px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">
                <FiSun className="mr-2" /> My Day
              </button>
            </li>
            <li>
              <button onClick={() => handleFilter('week')} className="flex items-center rounded-md shadow px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">
                <FiCalendar className="mr-2" /> Next 7 Days
              </button>
            </li>
            <li>
              <button onClick={() => handleFilter('all')} className="flex items-center rounded-md shadow px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left">
                <FiClipboard className="mr-2" /> All My Tasks
              </button>
            </li>
            <li>
              <Link to="/" className="flex items-center rounded-md shadow px-4 py-2 text-gray-700 hover:bg-gray-200">
                <FiList className="mr-2" /> My Calendar
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col p-6 md:ml-max relative">
        <div className="flex justify-between items-center mb-4 bg-white p-4 z-40 rounded shadow">
          <button onClick={handleSidebarToggle} className="md:hidden">
            <FiMenu className="text-2xl mr-4" />
          </button>
          <div className="relative flex-1 mr-6">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded"
              placeholder="Search"
            />
            <FiSearch className="absolute top-2.5 left-3 text-gray-500" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative" ref={refs}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                <FiBell className="text-2xl" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-40">
                  <ul className="py-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <li key={notification.id}>
                        <button
                          onClick={() => handleNotificationClick(notification.id)}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-200 w-full text-left"
                        >
                          {notification.title}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="flex flex-col items-center justify-center py-4 text-gray-500">
                      <FiBellOff className="text-4xl mb-2" />
                      <span>No notifications yet</span>
                    </li>
                  )}
                  </ul>
                </div>
              )}
            </div>
            <div className="h-6 border-l border-gray-300"></div>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xl">
                    {getInitial(fullName)}
                  </div>
                )}
                <span className="ml-2 hidden md:block">{fullName}</span>
                <FiChevronDown className="ml-1" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                <div className="px-4 py-3">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}
                      >
                        <FiUser className="mr-2" />
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-500`}
                        onClick={handleLogout}
                      >
                        <FiLogOut className="mr-2" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto mb-4">
        <TransitionGroup component="ul">
          {filteredTasks.map((task) => (
            <CSSTransition key={task.id} timeout={300} classNames="task">
              <li className="mb-2 p-4 bg-white rounded shadow text-gray-700 hover:bg-gray-200 flex justify-between items-center">
                {editTaskId === task.id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className={`border rounded p-2 ${editTitle === '' ? 'border-red-500' : ''}`}
                    />
                    <button onClick={handleEditSubmit} className="ml-2 bg-blue-500 text-white p-2 rounded">
                      Save
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleTaskClick(task.id)} className="text-gray-700 w-full text-left">
                    {task.title}
                  </button>
                )}
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <FiMoreVertical className="h-6 w-6" />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 mt-2 z-50 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                    <div className="px-4 py-3">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => handleEdit(task.id, task.title)}
                          >
                            Edit Title
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => handleRemindMe(task.id)}
                          >
                            Remind me
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-500`}
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete Task
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Menu>
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
        </div>
        <form onSubmit={handleAddTask} className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 p-2 border border-sky-700 rounded"
              placeholder="Add task"
            />
          </div>
        </form>
        {selectedTaskId !== null && (
          <CSSTransition in={selectedTaskId !== null} timeout={300} classNames="task-details" unmountOnExit>
            <TaskDetails
              taskId={selectedTaskId}
              onClose={() => setSelectedTaskId(null)}
              fetchTasks={fetchTasks}
            />
          </CSSTransition>
        )}
        <CSSTransition in={showReminder} timeout={300} classNames="popup" unmountOnExit>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg" ref={refs}>
              <h2 className="text-lg text-center mb-4">Reminder</h2>
              <DatePicker
                selected={reminderDate}
                onChange={(date) => setReminderDate(date)}
                showTimeSelect
                dateFormat="Pp"
                inline
                className="w-full mb-4"
              />
              <div className="flex mt-4">
                <button
                  onClick={() => setShowReminder(false)}
                  className="flex-1 justify-start px-4 py-2 mr-2 bg-gray-300 text-black hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSetReminder}
                  className="flex-1 justify-end px-4 py-2 ml-2 bg-blue-500 text-white hover:bg-blue-400 rounded-lg"
                >
                  Set
                </button>
              </div>
            </div>
          </div>
        </CSSTransition>
      </main>
    </div>
  );
};

export default Dashboard;