class ApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    } 
}   
export default ApiError;