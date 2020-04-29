import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './styles/styles.css';

const wrapper = document.getElementById('container');
if (wrapper) {
  ReactDOM.render(<App />, wrapper);
}
