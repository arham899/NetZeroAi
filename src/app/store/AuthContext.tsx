import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    signup: (userData: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await apiService.getCurrentUser();
                    setUser(userData);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    logout();
                }
            }
            setIsLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (credentials: any) => {
        try {
            const data = await apiService.login(credentials);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        } catch (error) {
            throw error;
        }
    };

    const signup = async (userData: any) => {
        try {
            const data = await apiService.signup(userData);
            localStorage.setItem('token', data.token);
            setToken(data.token);
            setUser(data.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
