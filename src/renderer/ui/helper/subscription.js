let intervalId = null;
export const subscribe = (value, cb) => {
  console.log('subscribing ...', value);

  cb(value);
  let currentValue = value;
  intervalId = setInterval(() => {
    currentValue += 1;
    cb(currentValue);
  }, 1000);
};

export const unsubscribe = () => {
  console.log('un-subscribing ...');
  clearInterval(intervalId);
};
