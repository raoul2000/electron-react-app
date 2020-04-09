import React from 'react';
import PropTypes from 'prop-types';


const Form = ({ title }) => {
  const handleClick = () => window.sendAsyncMessage('piiing');
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
