import axios from "axios";
import { URL_API_Portal } from "./env";

const http = axios.create({
    baseURL: URL_API_Portal,
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`,
        'Access-Control-Allow-Methods':'*',
    }
})

export default new class UserService{
    getUsers(){
        return http.get('user');
    }
    getUsersID(id){
        return http.get(`user/get/${id}`);
    }
    activeUser(id){
        return http.get(`user/active/${id}`);
    }
    resetPasswordUser(id){
        return http.get(`reset-password/${id}`);
    }

    addUser(data){
        return http.post(`user/add`, data);
    }
    updateUser(id,data){
        return http.post(`user/update/${id}`, data);
    }
    logoutUser(){
        return http.post(`logout`);
    }
}