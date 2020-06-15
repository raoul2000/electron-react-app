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
  interface Response {
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
     * progress data
     */
    progress?:any;    
    /**
     * When this property is TRUE, the response handler is not discared after invocation and will remain
     * available for further response processing. This is the case for a task that 
     */
    scheduled?: boolean;
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

  type WorkerResultCallback = (error: any, result?: any) => void;
  type WorkerProgressCallback = (progress: any) => void;

  interface ExWindow extends Window {
    showSaveDialog?: any;
    showOpenDialog?: any;
    /**
     * Send a command to the worker
     */
    sendToWorker?: (cmd: string, payload: any, resultCallback?: WorkerResultCallback, progressCallback?: WorkerProgressCallback) => void;
  }

  interface QueueInfo {
    concurrency: number;
    size: number;
    pending: number;
    isPaused: boolean;
    isIdle: boolean;
  }
  /**
   * Message exchanged between the client and the worker components
   */
  interface WorkerMessage {
    /**
     * Identifier used to link a request with its response
     */
    transactionId: string;
  }
  interface WorkerRequest extends WorkerMessage {
    /**
     * Name of the command the worker is required to execute
     */
    cmd: string;
    /**
     * Optionnal data object that may be required by the worker to be able to
     * execute the command
     */
    payload?:any;
  }

  interface WorkerResponse extends WorkerMessage {
    /**
     * The result of the command execution. This property must be set when
     * the execution completes successfully.
     */
    result?: any;
    /**
     * This property is set when the WorkerRequest could not be completed successfully
     * and in this case, this property hold information about the error.
     */
    error?: any;
    /**
     * progress data
     */
    progress?:any;    
    /**
     * When this property is ot set or falsy, the response handler is discarded once the response has been
     * handled. Other
     * is TRUE, the response handler is not discared after invocation and will remain
     * available for further response processing. This is mainly the case for shceduled tasks
     */
    scheduled?: boolean;
  }
  interface RequestDescriptor {
    request: WorkerRequest;
    resultCb: WorkerResultCallback;
    progressCb: WorkerProgressCallback;
  }
}
