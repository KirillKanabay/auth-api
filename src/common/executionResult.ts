enum ErrorType {
    Failure,
    NotFound
}

export class ExecutionResult<T> {
    private constructor(
        public isSuccess: boolean,
        public data?: T,
        public errors?: string[],
        public errorType?: ErrorType) {
    }

    static success<T>(data?: T) : ExecutionResult<T> {
        return new ExecutionResult(true, data);
    }

    static fail<T>(errors: string[]) : ExecutionResult<T> {
        return new ExecutionResult<T>(false, undefined, errors, ErrorType.Failure);
    }

    static notFound<T>(errorMessage: string) : ExecutionResult<T> {
        return new ExecutionResult<T>(false, undefined, [errorMessage], ErrorType.NotFound);
    }
}