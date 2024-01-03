import http from "../http-auth";

export default new class User_SpdkApproveService{

    // Atasan
    getAtasan(){
        return http.get(`superior/index`);
    }
    getApproveAtasan(id){
        return http.get(`superior/approve/${id}`);
    }
    putDeclineAtasan(id,data){
        return http.put(`superior/decline/${id}`,data);
    }

    // Pemberi Tugas
    getPemberiTugas(){
        return http.get(`assignor/index`);
    }
    getApprovePemberiTugas(id){
        return http.get(`assignor/approve/${id}`);
    }
    putDeclinePemberiTugas(id,data){
        return http.put(`assignor/decline/${id}`,data);
    }
}