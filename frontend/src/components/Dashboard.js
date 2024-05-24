import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
// eslint-disable-next-line
import { FiMoreVertical, FiUser, FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  // eslint-disable-next-line
  const [remindMeTaskId, setRemindMeTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tasks/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  const handleEdit = (taskId, currentTitle) => {
    setEditTaskId(taskId);
    setEditTitle(currentTitle);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${editTaskId}/`,
        { title: editTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks(tasks.map(task => (task.id === editTaskId ? { ...task, title: editTitle } : task)));
      setEditTaskId(null);
      setEditTitle('');
    } catch (error) {
      console.error(`Error updating task with ID: ${editTaskId}`, error);
    }
  };

  const handleRemindMe = async (taskId) => {
    try {
      const task = tasks.find(task => task.id === taskId);
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { remind_me: !task.remind_me },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTasks(tasks.map(task => (task.id === taskId ? { ...task, remind_me: !task.remind_me } : task)));
      setRemindMeTaskId(null);
    } catch (error) {
      console.error(`Error updating task with ID: ${taskId}`, error);
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
    } catch (error) {
      console.error(`Error deleting task with ID: ${taskId}`, error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
	  <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
	    <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none">
            <FiUser className="h-6 w-6" />
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
                    Logout
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 p-4 bg-white rounded shadow flex justify-between items-center">
            {editTaskId === task.id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="border rounded p-2"
                />
                <button onClick={handleEditSubmit} className="ml-2 bg-blue-500 text-white p-2 rounded">
                  Save
                </button>
              </div>
            ) : (
              <Link to={`/tasks/${task.id}`} className="text-blue-500">
                {task.title}
              </Link>
            )}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <FiMoreVertical className="h-6 w-6" />
              </Menu.Button>
              <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
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
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;