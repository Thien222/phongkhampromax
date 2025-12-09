import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAdmin: boolean;
    login: () => void;
    logout: () => void;
    showLoginModal: () => void;
    hideLoginModal: () => void;
    isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Check sessionStorage on load to persist login during session
    useEffect(() => {
        const sessionAdmin = sessionStorage.getItem('isAdmin');
        if (sessionAdmin === 'true') {
            setIsAdmin(true);
        }
    }, []);

    const login = () => {
        setIsAdmin(true);
        sessionStorage.setItem('isAdmin', 'true');
        setIsLoginModalOpen(false);
    };

    const logout = () => {
        setIsAdmin(false);
        sessionStorage.removeItem('isAdmin');
    };

    const showLoginModal = () => setIsLoginModalOpen(true);
    const hideLoginModal = () => setIsLoginModalOpen(false);

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout, showLoginModal, hideLoginModal, isLoginModalOpen }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
