export type ResponseErrorType =
    | 'UserNotFound'
    | 'InvalidPassword'
    | 'InvalidUser'
    | 'InvalidDB'
    | 'ServerError'
    | 'SystemAlreadyInstalled'
    | 'init_db'
    | 'InvalidJWTToken';

export type ModuleType = 'core' | 'auth' | 'users';

export default class ResponseError {
    private module: ModuleType;
    private type: ResponseErrorType;
    private message: string;
    private error: Error;

    constructor(
        module: ModuleType,
        type: ResponseErrorType,
        message: string,
        error?: Error
    ) {
        this.module = module;
        this.type = type;
        this.message = message;
        this.error = error;

        return this;
    }
}
