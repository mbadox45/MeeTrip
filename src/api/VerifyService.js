import axios from "axios";
import { URL_API_Portal, APP_ID } from "./env";

const http = axios.create({
    baseURL: URL_API_Portal,
})

class VerifyService{
    getUser(id,headers){
        return http.get(`user/get/${id}`, headers);
    }
    getAkses(headers){
        return http.get(`akses/app/get/${APP_ID}`, headers);
    }

    // GET KURS MATA UANG
    getKurs(){
        return http.get('load/kurs');
    }
}

export default new VerifyService;