class ApiResponse <T>{
    statusCode : number;
    message : any;
    data ?: T;
    success : boolean;
    constructor(
       statusCode : number,
       message : any="Success",
       data ?: T ,
       
    )
    {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}

export { ApiResponse};