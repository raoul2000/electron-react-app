const axios = require('axios').default;

const runDummyTask = (task) => {
  console.log('running', task);
  return axios.get('https://randomuser.me/api/')
    .then((response) => response.data);
};

module.exports = {
  runDummyTask
};
