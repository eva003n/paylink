class ServiceError extends Error {
    override message: string;
    url: string;

    constructor(message: string, url: string) {
      const { stackTraceLimit } = Error;

      // prevent generating stack trace twice
      Error.stackTraceLimit = 0;
      super();
      Error.stackTraceLimit = stackTraceLimit;

      this.message = message;
      this.url = url;
      // capture stack trace manually
      if(!this.stack) {
        // capture the stack trace fo this for this instance and set its stack property
        Error.captureStackTrace(this, this.constructor)
      }
    }
}

export default ServiceError;