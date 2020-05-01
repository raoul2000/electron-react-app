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
     * and recevied phases. It must be unique accors the application.
     */
    transactionId: string;
    /**
     * The actual task to run
     */
    task: Task;
    interval?: number;
    subscribe?: boolean;
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
