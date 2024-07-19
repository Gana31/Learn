
class ApiError extends Error{
  statusCode : Number;
  constructor(  
            statusCode:Number, 
            message : string
    ){
        super(message)
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor)
        
    }
}

export default ApiError;