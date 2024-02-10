import axios from 'axios';

const baseURL = 
    window.location.hostname === "localhost"
    ? "http://localhost:3000/"
    : "http://192.168.1.12:3000/";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 404) {
        window.location.href = '/not-found';
      }
      return Promise.reject(error);
    }
  );
  
export default api;