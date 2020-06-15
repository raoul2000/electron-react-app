declare namespace Task {

  type ProgressCallback = (progress: any) => void;
  type Executor = (tasl: any, progressCb?: ProgressCallback ) => Promise<any>;
  type ExecutorMap = Map<string, Executor>;

  interface Descriptor {
    id: string;
    execute: Executor
  }
}