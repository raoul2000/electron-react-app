declare namespace App {
  /**
   * Task that can be sent to task runner
   */
  interface Task {
    id: string;
    type: string;
    description?: string;
    arg: any;
  }
  type TaskSubscriptionCallback = (error: any, result?: any) => void;
  interface TaskChannel {
    submitTask: (task: App.Task) => Promise<any>;
    subscribeTask(task: App.Task, notify: TaskSubscriptionCallback): void;
    unsubscribeTask(task: App.Task): void;
  }

  interface TaskRequest {
    /**
     * For a given task, the transaction Id is persistent between the send
     * and recevied phases. It must be unique across the application.
     */
    transactionId: string;
    /**
     * The actual task to run
     */
    task: Task;
    /**
     * When TRUE, send a task subscription request to the worker. When FALSE
     * sends an unsubscription request for the task. In case of a task that must be only executed
     * once, this property must not be defined
     */
    subscribe?: boolean;
    /**
     * Interval in seconds between 2 tasks execution. This property is used only when `subscribe`is also TRUE
     */
    interval?: number;
  }
  interface TaskResponse {
    /**
     * For a given task, the transaction Id is persistent between the send
     * and recevied phases. It must be unique accors the application.
     */
    transactionId: string;
    taskId: string;
    /**
     * The result of the task execution. This property must be set when
     * the execution completes successfully.
     */
    result?: any;
    /**
     * An error object describing a failed task execution
     */
    error?: any;
    /**
     * TRUE when the response is the result of a subscribed task
     */
    subscribe?: boolean;
  }

  interface TaskExecutor {
    id: string;
    execute: (task: App.Task) => Promise<any>;
  }

  interface ExWindow extends Window {
    showSaveDialog?: any;
    showOpenDialog?: any;
    taskChannel?: TaskChannel;
  }
}
