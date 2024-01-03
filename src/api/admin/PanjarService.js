import http from "../http-auth";

export default new class Admin_PanjarService{
    getApproveSPDK(id){
        return http.get(`panjar-spdk/approve/${id}`);
    }
    putRevisiSPDK(id,data){
        return http.put(`panjar-spdk/revisi/${id}`,data);
    }
}