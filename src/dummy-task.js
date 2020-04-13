const axios = require('axios').default;

const runDummyTask = (task) => {
  console.log('running', task);
  return axios.get('https://randomuser.me/api/ssss');
};

module.exports = {
  runDummyTask
};
