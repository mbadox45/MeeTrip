import http from "../http-auth";
import http_multipart from "../http-multipart";

export default new class Admin_SpdkAdminService{
    getSPDK(){
        return http.get('index-spdk');
    }
    getDetailSPDK(id){
        return http.get(`index-spdk/detail/${id}`);
    }
    putUpdateSPDK(id,data){
        return http_multipart.put(`admin-spdk/update/${id}`,data);
    }
    putCreateSurat(id,data){
        return http.put(`surat-spdk/create/${id}`,data);
    }
    putSubmitSurat(id){
        return http.put(`surat-spdk/submit/${id}`);
    }
}