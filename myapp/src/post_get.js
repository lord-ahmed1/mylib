import axios from "axios";



class RequestHandeler{
    constructor(baseUrl){
        this.token=localStorage["token"]
        this.refreshToken=localStorage["refreshToken"]
        this.baseUrl=baseUrl
        this.recieved_data=""
        this.success_result=1
    }
    setHeader(){
        axios.defaults.headers.common["Authorization"]=`Bearer ${localStorage["accessToken"]}`
    }
    async refreshToken_method(){
        await axios.post(this.baseUrl+"/token",{"token":localStorage["refreshToken"]}).then((result)=>{
            if(result.status=="401"){this.success_result= 0;}
            else{
                localStorage["accessToken"]=result.data.accessToken
                this.success_result= 1
            }
        }).catch(err=>{console.log(err)})
        return this.success_result
    }
    async get(path,reactSetter,navigate,data={}){
        this.setHeader()
        
        axios.get(this.baseUrl+path,{params:data}).then( (result)=>{
            if(result.status=="403"){let success=this.refreshToken_method()
                success.then(success_result=>{
                    if(success_result==1){this.setHeader();this.get(path,reactSetter,navigate,data)} else{navigate("/login/")} 
            }) }
            else{ if(result.status=="401"){navigate("/login/")}else{reactSetter(result.data)} }
        }).catch(err=>{console.log(err)})
       
    }
    async post(path,data_to_be_sended,reactSetter,navigate){
        this.setHeader()
        axios.post(this.baseUrl+path,data_to_be_sended).then( (result)=>{
            
            if(result.status=="403"){
                let success=this.refreshToken_method();
                success.then(success_result=>{
                    if(success_result==1){this.setHeader();this.post(path,data_to_be_sended,reactSetter,navigate)} else{navigate("/login/")} 
                }) }
            else{ if(result.status=="401"){navigate("/login/")}else{reactSetter(result.data)} }
            
        }).catch(err=>{console.log(err)})
    }    
    async delete(path,reactSetter,navigate){
        this.setHeader()
        axios.delete(this.baseUrl+path).then( (result)=>{
            
            if(result.status=="403"){
                let success=this.refreshToken_method();
                success.then(success_result=>{
                    if(success_result==1){this.setHeader();this.delete(path,reactSetter,navigate)} else{navigate("/login/")} 
                }) }
            else{ if(result.status=="401"){navigate("/login/")}else{reactSetter(result.data)} }
            
        }).catch(err=>{console.log(err)})
    }  
}

export default RequestHandeler