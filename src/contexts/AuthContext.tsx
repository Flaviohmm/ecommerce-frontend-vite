
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuração da URL base da API
const API_BASE_URL = 'http://localhost:8080';


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao fazer login');
            }

            const authResponse: AuthResponse = await response.json();

            setUser(authResponse.user);
            setToken(authResponse.token);

            // Salvar no localStorage
            localStorage.setItem('auth_token', authResponse.token);
            localStorage.setItem('current_user', JSON.stringify(authResponse.user));
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao registrar usuário');
            }

            // Registro bem-sucedido - não loga automaticamente
            // O controller retorna { message: "Conta criada com sucesso! Agora faça login." }
            
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
    };

    // Verificar se há usuário e token salvos no localStorage ao inicializar
    React.useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('current_user');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
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

// Hook utilitário para fazer requisições autenticadas
export const useAuthenticatedFetch = () => {
    const { token, logout } = useAuth();

    const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Adicionar headers existentes
        if (options.headers) {
            Object.entries(options.headers).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    headers[key] = value;
                }
            });
        }

        // Adicionar token de autorização se disponível
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Se receber 401 (Unauthorized), fazer logout automático
        if (response.status === 401) {
            logout();
            throw new Error('Sessão expirada. Faça login novamente.');
        }

        return response;
    };

    return authenticatedFetch;
};
