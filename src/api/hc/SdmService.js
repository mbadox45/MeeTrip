import http from "../http-auth";

export default new class Hc_SdmService{
    // Approve SPDK
    getApproveSPDK(id){
        return http.get(`hc/approve/${id}`);
    }
    putDeclineSPDK(id,data){
        return http.put(`hc/approve/${id}`,data);
    }

    // BOM
    getBOM(){
        return http.get(`index-bom-user`);
    }
    postBOM(data){
        return http.post(`bom-user/add`, data);
    }
    putBOM(id,data){
        return http.put(`bom-user/update/${id}`, data);
    }
}