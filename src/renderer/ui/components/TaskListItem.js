import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { playTask, stopTask } from './actions';

const TaskListItem = ({ task, onPlayTask, onStopTask }) => {
  const handlePlay = () => {
    onPlayTask(task);
  };
  const handleStop = () => {
    onStopTask(task);
  };
  return (
    <div>
      task id :
      {task.id}
      <div className="buttons">
        <button className="button is-small" type="button" onClick={handlePlay}>play</button>
        <button className="button is-small" type="button" onClick={handleStop}>stop</button>
      </div>
    </div>
  );
};

TaskListItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  onPlayTask: PropTypes.func.isRequired,
  onStopTask: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  onPlayTask: playTask,
  onStopTask: stopTask
};

export default connect(null, mapDispatchToProps)(TaskListItem);
