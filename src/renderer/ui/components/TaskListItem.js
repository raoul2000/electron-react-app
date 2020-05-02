import React from 'react';

const TaskListItem = ({ task }) => {
  console.log(task);
  return (
    <div>
      task id :
      {task.id}
    </div>
  );
};

export default TaskListItem;
