import axios from "axios";

let baseURL = "http://localhost:8000/";
// let baseURL = "http://api.siwira.id/api/";

const http = axios
http.defaults.baseURL = baseURL;
http.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
});


export default http;