import http from "../http-auth";

export default new class Hc_SdmService{
    getApproveSPDK(id){
        return http.get(`hc/approve/${id}`);
    }
    putDeclineSPDK(id,data){
        return http.put(`hc/approve/${id}`,data);
    }
}