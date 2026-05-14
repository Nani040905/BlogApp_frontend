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
      
      // Optionally redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
