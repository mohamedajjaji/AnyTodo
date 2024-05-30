import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { FiArrowRight, FiBell, FiTag, FiCheckSquare, FiTrash2, FiX, FiCircle, FiTrash } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useDropzone } from 'react-dropzone';
import dayjs from 'dayjs';

const TaskDetails = ({ taskId, onClose, fetchTasks }) => {
  const [task, setTask] = useState(null);
  const [notes, setNotes] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [remindMe, setRemindMe] = useState(null);
  const refs = useRef(null);

  const handleClickOutside = useCallback((event) => {
    if (refs.current && !refs.current.contains(event.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setTask(response.data);
        setNotes(response.data.notes || '');
        setSubtasks(response.data.subtasks || []);
        setAttachments(response.data.attachments || []);
        setRemindMe(response.data.remind_me ? new Date(response.data.remind_me) : null);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTask();
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [taskId, handleClickOutside]);

  const handleTitleChange = async (e) => {
    const updatedTitle = e.target.value;
    setTask({ ...task, title: updatedTitle });
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { title: updatedTitle },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleTagsChange = async (e) => {
    const updatedTags = e.target.value;
    setTask({ ...task, tags: updatedTags });
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { tags: updatedTags },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating tags:', error);
    }
  };

  const handleNotesChange = async (e) => {
    const updatedNotes = e.target.value;
    setNotes(updatedNotes);
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { notes: updatedNotes },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const handleAddSubtask = async (e) => {
    if (!newSubtask.trim()) return;
    try {
      const response = await axios.post(
        `http://localhost:8000/api/subtasks/`,
        { title: newSubtask, task: taskId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSubtasks([...subtasks, response.data]);
      setNewSubtask('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding subtask:', error);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    try {
      const subtask = subtasks.find(subtask => subtask.id === subtaskId);
      await axios.patch(
        `http://localhost:8000/api/subtasks/${subtaskId}/`,
        { completed: !subtask.completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setSubtasks(subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      ));
      fetchTasks();
    } catch (error) {
      console.error('Error toggling subtask:', error);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await axios.delete(`http://localhost:8000/api/subtasks/${subtaskId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setSubtasks(subtasks.filter(subtask => subtask.id !== subtaskId));
      fetchTasks();
    } catch (error) {
      console.error('Error deleting subtask:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', taskId);

    try {
      const response = await axios.post(
        `http://localhost:8000/api/attachments/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setAttachments((prevAttachments) => [...prevAttachments, response.data]);
      fetchTasks();
    } catch (error) {
      console.error('Error adding attachment:', error);
    }
  }, [taskId, fetchTasks]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/attachments/${attachmentId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAttachments(attachments.filter(attachment => attachment.id !== attachmentId));
      fetchTasks();
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
  };

  const handleCompleteTask = async () => {
    try {
      const updatedCompleteStatus = !task.complete;
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { complete: updatedCompleteStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setTask({ ...task, complete: updatedCompleteStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling complete status:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchTasks();
      onClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleRemindMeChange = async (date) => {
    setRemindMe(date);
    try {
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { remind_me: date.toISOString() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating remind me:', error);
    }
  };

  if (!task) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-1/3 bg-white shadow-lg p-4 z-50 overflow-y-auto task-details" ref={refs}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 mb-4">
          <FiArrowRight className="text-2xl" />
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCompleteTask}
            className={`flex items-center space-x-1 px-2 py-1 rounded ${task.complete ? 'bg-green-500 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'}`}
          >
            <FiCheckSquare />
            <span>{task.complete ? 'Task complete' : 'Mark as complete'}</span>
          </button>
          <button
            onClick={handleDeleteTask}
            className="flex items-center space-x-1 bg-red-500 px-2 py-1 rounded text-white hover:bg-red-600"
          >
            <FiTrash2 />
            <span>Delete</span>
          </button>
        </div>
      </div>
      <input
        type="text"
        value={task.title}
        onChange={handleTitleChange}
        className="text-3xl focus:outline-none font-bold mb-4 w-full"
        disabled={task.complete}
      />
      <div className="flex items-center space-x-2 mb-4">
        <button className="flex items-center space-x-1 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
          <FiTag />
          <input
            type="text"
            value={task.tags}
            onChange={handleTagsChange}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-center"
            placeholder="Tags"
            disabled={task.complete}
          />
        </button>
        <div className={`flex items-center space-x-1 px-2 py-1 rounded ${remindMe ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black hover:bg-gray-300'}`}>
          <FiBell />
          <DatePicker
            selected={remindMe}
            onChange={handleRemindMeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-center"
            placeholderText="Remind me"
            disabled={task.complete}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={handleNotesChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Insert your notes here"
          disabled={task.complete}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Subtasks</label>
        <ul>
          <TransitionGroup component={null}>
            {subtasks.map((subtask) => (
              <CSSTransition key={subtask.id} timeout={300} classNames="subtask">
                <li className={`flex items-center space-x-2 mb-2 p-2 rounded ${subtask.completed ? 'bg-gray-200' : 'bg-white'} hover:bg-gray-100`}>
                  <FiCircle
                    className={`cursor-pointer ${subtask.completed ? 'text-green-500' : 'text-gray-500'}`}
                    onClick={() => handleToggleSubtask(subtask.id)}
                  />
                  <span className={`flex-1 ${subtask.completed ? 'line-through' : ''}`}>{subtask.title}</span>
                  <FiX
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  />
                </li>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSubtask(e);
          }}
        >
          <input
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Add a new subtask"
            disabled={task.complete}
          />
        </form>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Attachments</label>
        <div {...getRootProps()} className="border-dashed border-2 border-gray-500 hover:border-blue-500 mt-4 p-2 rounded hover:text-blue-500 text-gray-700 text-center cursor-pointer">
          <input {...getInputProps()}/>
          Click to add / drop your files here
        </div> 
        <ul className="mt-4">
          {attachments.map((attachment) => (
            <li key={attachment.id} className="flex items-center justify-between mt-2">
              <div>
                <a href={attachment.file} className="text-blue-500" target="_blank" rel="noopener noreferrer">
                  {attachment.file.split('/').pop()}
                </a>
                <p className="text-gray-400 text-xs">
                  {dayjs(attachment.uploaded_at).format('MMMM D, YYYY')}
                </p>
              </div>
              <FiTrash
                className="text-gray-400 hover:text-red-500 cursor-pointer"
                onClick={() => handleDeleteAttachment(attachment.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskDetails;