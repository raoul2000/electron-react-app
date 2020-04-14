declare namespace App {
  /**
   * Task that can be sent to task runner
   */
  interface Task {
    id:string;
    type:string;
    description?:string;
    arg:any;
  }

  interface TaskRunner {
    submitTask:(task: App.Task) => Promise<any>;
  }

  interface TaskRequest {
    /**
     * For a given task, the transaction Id is persistent between the send
     * and recevied phases. It must be unique accors the application.
     */
    transactionId:string;
    /**
     * The actual task to run
     */
    task:Task;
  }
  interface TaskResponse {
    /**
     * For a given task, the transaction Id is persistent between the send
     * and recevied phases. It must be unique accors the application.
     */
    transactionId:string;
    /**
     * The result of the task execution. This property must be set when
     * the execution completes successfully.
     */
    result?:any;
    /**
     * An error object describing a failed task execution
     */
    error?:any;
  }
  interface ExWindow extends Window {
    showSaveDialog?:any;
    showOpenDialog?:any;
    taskRunner?:TaskRunner;
  }
}