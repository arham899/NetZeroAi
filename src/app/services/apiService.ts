import axios from 'axios';
import { HistoryEntry } from '../types/calculatorTypes';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        console.log('[API] Request:', config.method?.toUpperCase(), config.url);
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to log errors
api.interceptors.response.use(
    (response) => {
        console.log('[API] Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('[API] Response error:', error.response?.status, error.response?.data, error.message);
        return Promise.reject(error);
    }
);

export const apiService = {
    // --- AUTH METHODS ---

    signup: async (userData: any) => {
        try {
            const response = await api.post('/auth/signup', userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    login: async (credentials: any) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/user');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // --- CALCULATION METHODS ---

    getHistory: async (): Promise<HistoryEntry[]> => {
        try {
            const response = await api.get('/history');
            return response.data;
        } catch (error) {
            console.error('Error fetching history:', error);
            throw error;
        }
    },

    addCalculation: async (entry: Omit<HistoryEntry, 'id' | 'date'>): Promise<HistoryEntry> => {
        try {
            const response = await api.post('/calculations', entry);
            return response.data;
        } catch (error) {
            console.error('Error saving calculation:', error);
            throw error;
        }
    },

    clearHistory: async (): Promise<void> => {
        try {
            await api.delete('/history');
        } catch (error) {
            console.error('Error clearing history:', error);
            throw error;
        }
    },

    getTreeRecommendations: async (location: string, carbonFootprint: number) => {
        try {
            const response = await api.post('/tree-recommendations', { location, carbonFootprint });
            return response.data;
        } catch (error) {
            console.error('Error getting tree recommendations:', error);
            throw error;
        }
    },

    getTreeSpecies: async (location: string, carbonFootprint: number) => {
        try {
            const response = await api.post('/tree-species', { location, carbonFootprint });
            return response.data;
        } catch (error) {
            console.error('Error getting tree species:', error);
            throw error;
        }
    }
};
