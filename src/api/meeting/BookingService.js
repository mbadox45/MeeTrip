import http from "../http-auth";
import http_multipart from "../http-multipart";

export default new class Meeting_BookingService{

    // Room
    getRoom(){
        return http.get('room/all');
    }
    getRoomID(id){
        return http.get(`room/get/${id}`);
    }
    postAddRoom(data){
        return http_multipart.post(`room/add/`,data);
    }
    putUpdateRoom(id,data){
        return http_multipart.put(`room/update/${id}`,data);
    }

    // Meeting Booking
    getAllBooking(){
        return http.get('booking/all');
    }
    getMyBooking(){
        return http.get('booking/mine');
    }
    getMyBookingID(id){
        return http.get(`booking/get/${id}`);
    }
    postAddBooking(data){
        return http.post(`booking/add/`,data);
    }
    putUpdateBooking(id,data){
        return http.put(`booking/update/${id}`,data);
    }
}