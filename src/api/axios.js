import axios from 'axios';
import { useAuth } from '../stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true, // Most of your requests use this
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the error is 401 Unauthorized, we reset the auth state
    if (error.response && error.response.status === 401) {
      const resetAuth = useAuth.getState().resetAuth;
      resetAuth();
      
      // We DO NOT redirect to login here anymore, 
      // because it causes loops on public pages like Home.
      // ProtectedRoute component will handle redirects for private routes.
    }
    return Promise.reject(error);
  }
);


export default api;
