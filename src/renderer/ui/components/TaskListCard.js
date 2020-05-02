import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TaskListItem from './TaskListItem';

const TaskListCard = ({ taskList }) => {
  console.log('TaskListCard');
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

TaskListCard.propTypes = {
  taskList: PropTypes.arrayOf(PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  })).isRequired
};

const mapStateToProps = (state) => ({
  taskList: state.taskList
});

export default connect(mapStateToProps)(TaskListCard);
