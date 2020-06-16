declare namespace Worker {


  type TransactionId = string;
  type ResultCallback = (error: any, result?: any) => void;
  type ProgressCallback = (progress: any) => void;
  /**
 * Message exchanged between the client and the worker components
 */
  interface Message {
    /**
     * Identifier used to link a request with its response
     */
    transactionId: TransactionId;
  }
  interface Request extends Message {
    /**
     * Name of the command the worker is required to execute
     */
    cmd: string;
    /**
     * Optionnal data object that may be required by the worker to be able to
     * execute the command
     */
    payload?: any;
  }
  interface Response extends Message {
    /**
     * The result of the command execution. This property must be set when
     * the execution completes successfully.
     */
    result?: any;
    /**
     * This property is set when the Request could not be completed successfully
     * and in this case, this property holds information about the error.
     */
    error?: any;
    /**
     * When this property is set, the response is assumed to contain progress information
     * about the request initially submitted to the worker.
     */
    progress?: any;
    /**
     * When this property is not set (or falsy), the response handler is discarded once the response has been
     * handled. This is the case for one-shot requests that expect a single result. 
     * When this property is TRUE, the response handler is not discared after invocation and will remain
     * available for further response processing. This is mainly the case for shceduled tasks.
     */
    keepHandler?: boolean;
  }
  interface ResponseHandler {
    resultCb: ResultCallback;
    progressCb: ProgressCallback;
  }
  /**
   * Describe the current state of the job queue
   */
  interface QueueInfo {
    concurrency: number;
    size: number;
    pending: number;
    isPaused: boolean;
    isIdle: boolean;
  }
}