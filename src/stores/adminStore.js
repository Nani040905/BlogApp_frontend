import { create } from 'zustand'
import api from '../api/axios'
import { toast } from 'react-hot-toast'

export const useAdminStore = create((set, get) => ({
    users: [],
    authors: [],
    articles: [],
    loading: false,
    error: null,

    fetchUsers: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/admin-api/users');
            set({ users: res.data.payload, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch users', loading: false });
            toast.error(get().error);
        }
    },

    fetchAuthors: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/admin-api/authors');
            set({ authors: res.data.payload, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch authors', loading: false });
            toast.error(get().error);
        }
    },

    fetchArticles: async () => {
        set({ loading: true });
        try {
            const res = await api.get('/admin-api/articles');
            set({ articles: res.data.payload, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || 'Failed to fetch articles', loading: false });
            toast.error(get().error);
        }
    },

    toggleUserStatus: async (userId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const res = await api.put(`/admin-api/toggle-user-status/${userId}`, { isActive: newStatus });
            
            // Update local state
            const updatedUser = res.data.payload;
            set((state) => ({
                users: state.users.map(u => u._id === userId ? updatedUser : u),
                authors: state.authors.map(a => a._id === userId ? updatedUser : a)
            }));
            
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update user status');
        }
    },

    toggleArticleStatus: async (articleId, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            const res = await api.put(`/admin-api/toggle-article-status/${articleId}`, { isArticleActive: newStatus });
            
            // Update local state
            const updatedArticle = res.data.payload;
            set((state) => ({
                articles: state.articles.map(a => a._id === articleId ? updatedArticle : a)
            }));
            
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update article status');
        }
    }
}));
