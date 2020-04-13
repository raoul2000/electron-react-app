
let taskCount = 0;
const tasks = new Map();

window.channel.receiveTaskResponse((taskResponse) => {
  console.log('taskRunner : receive result');
  const futureResult = tasks.get(taskResponse.id);
  if (futureResult) {
    if (taskResponse.error) {
      futureResult.reject(taskResponse.error);
    } else {
      futureResult.resolve(taskResponse.result);
    }
  }
});

const taskRunner = {
  submitTask: (task) => {
    console.log('submit task');
    const taskRequest = {
      id: `task-${taskCount}`,
      task
    };
    const futureResult = new Promise((resolve, reject) => {
      tasks.set(taskRequest.id, { resolve, reject });
      window.channel.sendTaskRequest(taskRequest);
    });
    taskCount += 1;
    return futureResult;
  }
};
export default taskRunner;
