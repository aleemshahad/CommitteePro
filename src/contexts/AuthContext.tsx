import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { storageService } from '../utils/storage';

interface AuthContextType extends AuthState {
    login: (email: string) => Promise<void>;
    logout: () => void;
    verifyMagicLink: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        // Check for existing session
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                const user: User = JSON.parse(storedUser);
                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('currentUser');
                setAuthState({ user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        }
    }, []);

    const login = async (email: string): Promise<void> => {
        // Simulate magic link sending
        // In production, this would call an API to send email
        const token = btoa(`${email}:${Date.now()}`);
        const magicLink = `${window.location.origin}/verify?token=${token}`;

        // Store token temporarily (in production, this would be server-side)
        const tokenData = {
            token,
            email,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
        };
        localStorage.setItem('pendingMagicLink', JSON.stringify(tokenData));

        // In production, send email here
        console.log('Magic Link:', magicLink);

        // For development, auto-verify after a short delay
        setTimeout(() => {
            verifyMagicLink(token);
        }, 1000);
    };

    const verifyMagicLink = async (token: string): Promise<void> => {
        try {
            const storedToken = localStorage.getItem('pendingMagicLink');
            if (!storedToken) {
                throw new Error('No pending magic link found');
            }

            const tokenData = JSON.parse(storedToken);
            if (tokenData.token !== token) {
                throw new Error('Invalid token');
            }

            if (new Date(tokenData.expiresAt) < new Date()) {
                throw new Error('Token expired');
            }

            const email = tokenData.email;

            // Check if user exists, if not create new user
            let user = storageService.getUserByEmail(email);

            if (!user) {
                user = {
                    id: crypto.randomUUID(),
                    email,
                    name: email.split('@')[0], // Use email prefix as default name
                    role: 'member', // Default role
                    createdAt: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                };

                // Save new user
                const users = storageService.getAllUsers();
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            } else {
                // Update last login
                user.lastLogin = new Date().toISOString();
                const users = storageService.getAllUsers();
                const index = users.findIndex(u => u.id === user!.id);
                if (index !== -1) {
                    users[index] = user;
                    localStorage.setItem('users', JSON.stringify(users));
                }
            }

            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.removeItem('pendingMagicLink');

            setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error) {
            console.error('Magic link verification failed:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                verifyMagicLink,
            }}
        >
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
