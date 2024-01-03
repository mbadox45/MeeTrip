import http from "../http-auth";

export default new class Admin_BteService{
    // BTE
    getApproveBTE(id){
        return http.get(`bte-spdk/approve/${id}`);
    }
    putRevisiBTE(id,data){
        return http.put(`bte-spdk/revisi/${id}`,data);
    }
    putCairBTE(id){
        return http.get(`bte-spdk/cair/${id}`);
    }
}