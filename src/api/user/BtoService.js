import http from "../http-auth";

export default new class User_BtoService{
    getPemberiTugas(){
        return http.get(`assignor/index`);
    }
    getApprove(id){
        return http.get(`assignor/approve/${id}`);
    }
    putDecline(id,data){
        return http.put(`assignor/decline/${id}`,data);
    }
}