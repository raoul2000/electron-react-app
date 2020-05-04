import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskListItem from './TaskListItem';
import { playTask, stopTask } from './actions';

const TaskListCard = ({ taskList, onPlayTask, onStopTask }) => {
  // usCallback is required in order to enable memoization of each
  // taskListItem component
  // @see https://dmitripavlutin.com/use-react-memo-wisely/#4-reactmemo-and-callback-functions
  const handlePlay = React.useCallback((taskId) => {
    const taskToPlay = taskList.find((task) => task.id === taskId);
    if (taskToPlay) {
      onPlayTask(taskToPlay);
    }
  }, []);

  const handleStop = React.useCallback((taskId) => {
    const taskToStop = taskList.find((task) => task.id === taskId);
    if (taskToStop) {
      onStopTask(taskToStop);
    }
  }, []);

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
            taskList.map((taskItem) => (
              <TaskListItem
                key={taskItem.id}
                id={taskItem.id}
                subscribe={taskItem.subscribe}
                result={taskItem.result}
                error={taskItem.error}
                onPlayTask={handlePlay}
                onStopTask={handleStop}
              />
            ))
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

TaskListCard.propTypes = {
  taskList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  })).isRequired,
  onPlayTask: PropTypes.func.isRequired,
  onStopTask: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  taskList: state.taskList
});
const mapDispatchToProps = {
  onPlayTask: playTask,
  onStopTask: stopTask
};
export default connect(mapStateToProps, mapDispatchToProps)(TaskListCard);
