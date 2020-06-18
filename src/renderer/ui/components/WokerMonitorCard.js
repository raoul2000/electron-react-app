import React, { useEffect, useState } from 'react';
import { subscribeQueueInfo } from '../helper/taskPlayer';

const WorkerMonitorCard = () => {
  console.log('worker monitor');

  const [queueInfo, setQueueInfo] = useState({
    concurrency: 0,
    size: 0,
    pending: 0,
    isPaused: null,
    isIdle: null,
    callCount: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      subscribeQueueInfo((error, qInfo) => {
        setQueueInfo({
          ...qInfo,
          callCount: queueInfo.callCount + 1
        });
      });
    }, 1000);
    return () => {
      console.log('clean useEffect');
      clearTimeout(timer);
    };
  });
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          Worker status (
          {queueInfo.callCount}
          )
        </p>
      </header>
      <div className="card-content">
        <div className="content">
          concurrency :
          {queueInfo.concurrency}
          <br />
          Size :
          {queueInfo.size}
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

export default WorkerMonitorCard;
