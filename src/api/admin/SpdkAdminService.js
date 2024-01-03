import http from "../http-auth";

export default new class Admin_SpdkAdminService{
    getSPDK(){
        return http.get('index-spdk');
    }
    getDetailSPDK(id){
        return http.get(`index-spdk/detail/${id}`);
    }
    putCreateSurat(id,data){
        return http.put(`surat-spdk/create/${id}`,data);
    }
    putSubmitSurat(id){
        return http.put(`surat-spdk/submit/${id}`);
    }
}