import http from "../http-auth";

export default new class User_SpdkApproveService{
    getAtasan(){
        return http.get(`superior/index`);
    }
    getApprove(id){
        return http.get(`superior/approve/${id}`);
    }
    putDecline(id,data){
        return http.put(`superior/decline/${id}`,data);
    }
}