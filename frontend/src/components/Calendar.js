import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const Calendar = ({ tasks, handleTaskClick }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  useEffect(() => {
    const tasksForDay = tasks.filter(task =>
      dayjs(task.due_date).isSame(selectedDate, 'day')
    );
    setTasksForSelectedDate(tasksForDay);
  }, [selectedDate, tasks]);

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const renderCalendarDays = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startDate = startOfMonth.startOf('week');
    const endDate = endOfMonth.endOf('week');

    let days = [];
    let day = startDate;

    while (day.isBefore(endDate)) {
      const currentDay = day;
      const isSameMonth = currentDay.month() === currentDate.month();
      const isSelected = currentDay.isSame(selectedDate, 'day');
      days.push(
        <div
          key={currentDay.format('YYYY-MM-DD')}
          className={`p-2 border rounded cursor-pointer ${isSameMonth ? 'bg-white' : 'bg-gray-100'} ${isSelected ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleDayClick(currentDay)}
        >
          {currentDay.date()}
        </div>
      );
      day = day.add(1, 'day');
    }

    return days;
  };

  return (
    <div className="bg-white rounded shadow p-4 text-gray-900">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>
            <FiArrowLeft className="text-2xl"/>
        </button>
        <h2 className="text-lg">{currentDate.format('MMMM YYYY')}</h2>
        <button onClick={handleNextMonth}>
            <FiArrowRight className="text-2xl"/>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        <div className="text-center font-bold">Sun</div>
        <div className="text-center font-bold">Mon</div>
        <div className="text-center font-bold">Tue</div>
        <div className="text-center font-bold">Wed</div>
        <div className="text-center font-bold">Thu</div>
        <div className="text-center font-bold">Fri</div>
        <div className="text-center font-bold">Sat</div>
        {renderCalendarDays()}
      </div>
      <div>
        <h3 className="text-lg mb-2">Tasks for {selectedDate.format('MMMM DD, YYYY')}</h3>
        <TransitionGroup component="ul">
          {tasksForSelectedDate.map((task) => (
            <CSSTransition key={task.id} timeout={300} classNames="task">
              <li className="mb-2 p-4 bg-gray-100 rounded shadow cursor-pointer" onClick={() => handleTaskClick(task.id)}>
                {task.title}
              </li>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default Calendar;