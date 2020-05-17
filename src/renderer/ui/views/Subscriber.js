import React from 'react';
import TaskListCard from '../components/TaskListCard';
import WorkerMonitorCard from '../components/WokerMonitorCard';

const Subscriber = () => {
  console.log('subscriber view');
  return (
    <div>
      <div className="columns">
        <div className="column is-4">
          <WorkerMonitorCard />
        </div>
        <div className="column is-8">
          <TaskListCard />
        </div>
      </div>
    </div>
  );
};

export default Subscriber;
