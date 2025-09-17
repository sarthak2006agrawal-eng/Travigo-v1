class ApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.status = statusCode;
    } 
}   
export default ApiError;