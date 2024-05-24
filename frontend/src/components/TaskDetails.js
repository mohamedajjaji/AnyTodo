import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TaskDetails = () => {
  const { taskId } = useParams();
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

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">{task.title}</h1>
      <p className="mb-2"><strong>Notes:</strong> {task.notes}</p>
      <p className="mb-2"><strong>Due date:</strong> {task.due_date}</p>
      <p className="mb-2"><strong>Priority:</strong> {task.priority ? 'Yes' : 'No'}</p>
      <p className="mb-2"><strong>Remind me:</strong> {task.remind_me ? 'Yes' : 'No'}</p>
      {/* Add more fields */}
    </div>
  );
};

export default TaskDetails;