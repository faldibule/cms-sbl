import axios from "axios";

export let baseURL = "http://localhost:8000/";

const http = axios
http.defaults.baseURL = baseURL;
http.interceptors.request.use((config) => {
   const token = localStorage.getItem("token");
   if (token) config.headers.Authorization = `Bearer ${token}`;
   return config;
});


export default http;