import http from "../http-auth";

export default new class User_DpService{
    getSubmitDP(id){
        return http.get(`downpayment/submit/${id}`);
    }
    postAddDP(id,data){
        return http.post(`downpayment/add/${id}`,data);
    }
    putUpdateDP(id,data){
        return http.put(`downpayment/update/${id}`,data);
    }
}