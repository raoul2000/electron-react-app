declare namespace App {
  /**
   * Task that can be sent to task runner
   */
  interface Task {
    id:string;
    description?:string;
    arg:any;
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
    result?:any;
    error?:any;
  }
}