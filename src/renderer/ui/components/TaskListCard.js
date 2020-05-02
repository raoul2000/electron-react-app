import React from 'react';
import TaskListItem from './TaskListItem';

const TaskListCard = () => {
  console.log('TaskListCard');

  const taskList = [
    {
      id: 'id-1',
      type: 'task-type',
      arg: { value: 1 },
      subscribe: true
    }
  ];

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          Task List
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          {
            taskList.map((taskItem) => <TaskListItem key={taskItem.id} task={taskItem} />)
          }
        </div>
      </div>
      <footer className="card-footer">
        <p className="card-header-title">
          Sample Task List
        </p>
      </footer>
    </div>

  );
};

export default TaskListCard;
