import http from "../http-auth";
import http_multipart from "../http-multipart";

export default new class User_SpdkFormService{
    getMySPDK(){
        return http.get('my-spdk');
    }
    getDetailMySPDK(id){
        return http.get(`index-spdk/detail/${id}`);
    }
    postAddMySPDK(data){
        return http_multipart.post(`my-spdk/add`,data);
    }
    putUpdateMySPDK(id,data){
        return http_multipart.put(`my-spdk/update/${id}`,data);
    }
    putCancelMySPDK(id,data){
        return http.put(`my-spdk/cancel/${id}`,data);
    }
}