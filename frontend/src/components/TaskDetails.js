import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiArrowRight } from 'react-icons/fi';

const TaskDetails = ({ taskId, onClose, fetchTasks }) => {
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTask(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTask();
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      fetchTasks();
    }
  }, [taskId, fetchTasks]);

  if (!task) {
    return ;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-lg p-4 z-50 overflow-y-auto task-details">
      <button onClick={onClose} className="text-gray-500 hover:text-gray-700 mb-4">
        <FiArrowRight className="text-2xl" />
      </button>
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="mb-2"><strong>Notes:</strong> {task.notes}</p>
      <p className="mb-2"><strong>Due date:</strong> {task.due_date}</p>
      <p className="mb-2"><strong>Priority:</strong> {task.priority ? 'Yes' : 'No'}</p>
      <p className="mb-2"><strong>Remind me:</strong> {task.remind_me ? 'Yes' : 'No'}</p>
      {/* Add more fields */}
    </div>
  );
};

export default TaskDetails;