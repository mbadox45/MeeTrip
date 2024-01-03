import http from "../http-auth";

export default new class Misc_PaguService{
    getAllUang(){
        return http.get('uang');
    }
    getUangByID(id){
        return http.get(`uang/${id}/get`);
    }
    getUangByJabatanWilayah(id_wil, id_lev){
        return http.get(`uang/wilayah/${id_wil}/level/${id_lev}`);
    }
    putUpdateUang(id,data){
        return http.put(`uang/${id}/update`,data);
    }
}