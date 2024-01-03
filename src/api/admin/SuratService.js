import http from "../http-auth";

export default new class Admin_SuratService{
    putCreateSurat(id,data){
        return http.put(`surat-spdk/create/${id}`,data);
    }
    putSubmitSurat(id){
        return http.put(`surat-spdk/submit/${id}`);
    }
}