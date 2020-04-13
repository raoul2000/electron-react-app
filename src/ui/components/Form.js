import React from 'react';
import PropTypes from 'prop-types';
import taskRunner from '../../task-runner';

const Form = ({ title }) => {
  const handleClick = () => {
    // window.sendAsyncMessage('piiing');
    taskRunner.submitTask('task1')
      .then(console.log)
      .catch(console.error);
  };
  return (
    <div>
      <h1>{title}</h1>
      <button type="button" onClick={handleClick}>send message</button>
    </div>
  );
};
Form.propTypes = {
  title: PropTypes.string
};
Form.defaultProps = {
  title: 'ciao tutti'
};

export default Form;
