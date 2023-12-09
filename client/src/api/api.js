import axios from 'axios';

const baseURL = 
    window.location.hostname === "localhost"
    ? "http://localhost:3000/"
    : "http://192.168.1.12:3000/";

const api = axios.create({
    baseURL: baseURL
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 404) {
        // Handle 404 error here, e.g., navigate to a "Not Found" page
        window.location.href = '/not-found'; // Update this with your actual route
      }
      return Promise.reject(error);
    }
  );
  
export default api;