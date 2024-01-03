import http from "../http-pdf";

export default new class Misc_PdfService{
    getDpDalamNegeri(id){
        return http.get(`pdf/${id}/pengajuan-panjar-dalam-negeri`);
    }
    getDpLuarNegeri(id){
        return http.get(`pdf/${id}/pengajuan-panjar-luar-negeri`);
    }
    getSuratJalan(id){
        return http.get(`pdf/${id}/perintah-perjalanan-dinas`);
    }
    getBTO(id){
        return http.get(`pdf/${id}/bto`);
    }
    getBTEDalamNegeri(id){
        return http.get(`pdf/${id}/bte-dalam-negeri`);
    }
    getBTELuarNegeri(id){
        return http.get(`pdf/${id}/bte-luar-negeri`);
    }
}