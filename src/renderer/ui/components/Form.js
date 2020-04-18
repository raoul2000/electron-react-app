import React from 'react';
import PropTypes from 'prop-types';
import submitTask from '../helper/task';
import dialog from '../helper/dialog';

const Form = ({ title }) => {
  const submitDummyTask = () => {
    submitTask({
      id: '1',
      type: 'dummy',
      arg: 'hello'
    })
      .then(console.log)
      .catch(console.error);
    /*     setInterval(() => {
          submitTask({
            id: '1',
            type: 'dummy',
            arg: 'hello'
          })
            .then(console.log)
            .catch(console.error);
        }, 1000); */
  };

  const submitDumbTask = () => {
    submitTask({
      id: '1',
      type: 'dumb',
      arg: 'hello dumb boy'
    })
      .then(console.log)
      .catch(console.error);
  };

  const handleOpenDialog = () => {
    if (dialog.canShowSaveDialog()) {
      dialog.showSaveDialog({
        filters: [
          { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
          { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
          { name: 'Custom File Type', extensions: ['as'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
        .then(console.log)
        .catch(console.error);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <button type="button" onClick={submitDummyTask}>Dummy task</button>
      <button type="button" onClick={submitDumbTask}>Dumn one</button>
      <button type="button" onClick={handleOpenDialog}>open Dialog</button>
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
