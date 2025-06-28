
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string) => {
        setIsLoading(true);
        try {
            // Simulação de login - em produção, aqui seria uma chamada para API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: '1',
                email: email,
                name: email.split('@')[0]
            };

            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string) => {
        setIsLoading(true);
        try {
            // Simulação de registro - em produção, aqui seria uma chamada para API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockUser: User = {
                id: '1',
                email: email,
                name: email.split('@')[0]
            };

            setUser(mockUser);
            localStorage.setItem('user', JSON.stringify(mockUser));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Verificar se há usuário salvo no localStorage ao inicializar
    React.useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            isLoading
        }}>
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
