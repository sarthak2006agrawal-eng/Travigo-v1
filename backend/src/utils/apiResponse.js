export class ApiResponse {
  constructor(status, message, data = null){
    this.status = status;
    this.message= message;
    this.success = status>=200 && status<300;
    if(data)this.data = data;
  }
   

  send(res){
    const response = {
      success : this.success,
      message: this.message,
    }

    if(this.data){
      response.data = this.data;
    }

    return res.status(this.status).json(response); 
  }
}  