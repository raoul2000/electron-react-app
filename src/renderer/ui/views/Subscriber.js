import React from 'react';
import SubscriberCard from '../components/SubscriberCard';
import TaskListCard from '../components/TaskListCard';

const Subscriber = () => {
  console.log('subscriber view');
  return (
    <div>
      <div className="columns">
        <div className="column is-4">
          <SubscriberCard initialValue={0} />
        </div>
        <div className="column is-4">
          <TaskListCard />
        </div>
      </div>
    </div>
  );
};

export default Subscriber;
