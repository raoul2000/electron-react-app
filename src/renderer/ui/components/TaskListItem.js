import React from 'react';
import PropTypes from 'prop-types';

const TaskListItem = ({
  id, subscribe, result, error, onPlayTask, onStopTask
}) => {
  console.log(`render TaskListItem ${id}`);

  const handlePlay = () => onPlayTask(id);
  const handleStop = () => onStopTask(id);

  return (
    <div>
      task id :
      {id}
      result =
      {result}
      error =
      {error}
      <div className="buttons">
        <button disabled={subscribe === false} className="button is-small" type="button" onClick={handlePlay}>play</button>
        <button disabled={subscribe === true} className="button is-small" type="button" onClick={handleStop}>stop</button>
      </div>
    </div>
  );
};

TaskListItem.propTypes = {
  id: PropTypes.string.isRequired,
  subscribe: PropTypes.bool.isRequired,
  result: PropTypes.number,
  error: PropTypes.string,
  onPlayTask: PropTypes.func.isRequired,
  onStopTask: PropTypes.func.isRequired
};

TaskListItem.defaultProps = {
  error: null,
  result: null
};

export default React.memo(TaskListItem);
// export default TaskListItem;
