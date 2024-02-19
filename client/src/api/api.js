import axios from 'axios';

const baseURL = 
    window.location.hostname === "localhost"
    ? "http://localhost:3000/api/"
    : "http://192.168.1.12:3000/api/";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
});

let errorQueue = [];
let isRefreshingToken = false;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
		const originalRequest = error.config;

		if (error.response && error.response.status === 404) {
			window.location.href = '/not-found';
		}

		if (error.response && error.response.status === 401 && !originalRequest._retry && error.response.data.message === 'Token expired') {
            if (!isRefreshingToken) {
                isRefreshingToken = true;
                originalRequest._retry = true;
                console.log('Trying to aquire a new access token using a refresh token...');
        
                try {
                    const response = await api.post('/auth/tokens');
                    console.log('New access token has been aquired:', response.data);

                    isRefreshingToken = false;

                    errorQueue.forEach((req) => req.resolve(api(req.originalRequest)));
                    errorQueue = [];

                    return api(originalRequest);
                } catch (error) {
                    isRefreshingToken = false;
                    errorQueue.forEach((req) => req.reject(error));
                    errorQueue = [];
                    console.log('Refresh token is expired or invalid');
                    console.log('Removing cookies...');
                    const response = await api.delete('/auth');
                    console.log(response.data);
        
                    window.location.replace('/login');
                }
            } else {
                return new Promise((resolve) => {
                    errorQueue.push({ resolve, reject: () => resolve(api(originalRequest)), originalRequest });
                });
            }
        }
		
		return Promise.reject(error);
    }
  );
  
export default api;