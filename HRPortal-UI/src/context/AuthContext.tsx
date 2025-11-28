
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { HTTPUtils } from '../utils/httpUtils';
import type { User } from '../models/models';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    loading: boolean;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            // call local auth server (repo) which manages login and JWT cookie
            const res = await fetch('http://localhost:3000/api/check-auth', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error('Not authenticated');
            const data = await res.json() as { isAuthenticated: boolean; user: User };
            if (data.isAuthenticated) {
                setUser(data.user);
            }
        } catch (error) {
            console.log('Not authenticated');
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const data = await HTTPUtils.post<{ message: string; user: User }>('/login', { username, password });
        setUser(data.user);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:3000/api/logout', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
        } catch (err) {
            console.error('Logout error', err);
        }
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, logout, loading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
