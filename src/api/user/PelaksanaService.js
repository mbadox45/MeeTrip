import http from "../http-auth";

export default new class User_PelaksanaService{

    // Destination
    putAttendSPDK(id,data){
        return http.put(`destination/attend/${id}`,data);
    }
    putFinishSPDK(id){
        return http.put(`my-spdk/done/${id}`);
    }

    // Report
    postAddReport(id,data){
        return http.post(`report/add/${id}`,data);
    }
    putUpdateReport(id,data){
        return http.put(`report/update/${id}`,data);
    }

    // BTE
    postCreateBTE(id,data){
        return http.post(`bte/add/${id}`,data);
    }
    putUpdateBTE(id,data){
        return http.put(`bte/update/${id}`,data);
    }
    putSubmitBTE(id){
        return http.put(`bte/submit/${id}`);
    }
}