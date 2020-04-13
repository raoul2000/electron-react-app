import React from 'react';
import PropTypes from 'prop-types';
import submitTask from '../helper/task';

const Form = ({ title }) => {
  const handleClick = () => {
    submitTask('task1')
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
