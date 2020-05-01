import React from 'react';
import SubscriberCard from '../components/SubscriberCard';


const Subscriber = () => {
  console.log('subscriber view');
  return (
    <div>
      <div className="columns">
        <div className="column is-4">
          <SubscriberCard initialValue={0} />
        </div>
        <div className="column is-4">
          <SubscriberCard initialValue={34} />
        </div>
      </div>
    </div>
  );
};

export default Subscriber;
