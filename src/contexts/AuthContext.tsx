
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    role: 'customer' | 'admin';
}

interface AuthResponse {
    token: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginAdmin: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
    canManageProducts: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configuração da URL base da API
const API_BASE_URL = 'http://localhost:8080';


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Carregar dados do localStorage na inicialização
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
                console.log('✅ Dados de autenticação carregados do localStorage');
            } catch (error) {
                console.error('❌ Erro ao carregar dados do localStorage:', error);
                // Limpar dados corrompidos
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }

        setIsLoading(false);
    }, []);

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

            // Verificar se o usuário tem role definida
            if (!authResponse.user.role) {
                authResponse.user.role = 'customer'; // Default para customer
            }

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

    const loginAdmin = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao fazer login como administrador');
            }

            const authResponse: AuthResponse = await response.json();
            
            // Verificar se realmente é admin
            if (authResponse.user.role !== 'admin') {
                throw new Error('Acesso negado. Apenas administradores podem acessar.')
            }

            setUser(authResponse.user);
            setToken(authResponse.token);

            // salvar no localStorage
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

    const isAuthenticated = (): boolean => {
        return !!(user && token);
    };

    // Verificar se o usuário é admin
    const isAdmin = (): boolean => {
        return user?.role === 'admin';
    };

    // Verificar se pode gerenciar produtos (criar, editar, deletar)
    const canManageProducts = (): boolean => {
        return isAdmin();
    };

    // Verificar se há usuário e token salvos no localStorage ao inicializar
    React.useEffect(() => {
        const savedToken = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('current_user');

        if (savedToken && savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                // Garantir que o role existe
                if (!parsedUser.role) {
                    parsedUser.role = 'customer';
                }
                setToken(savedToken);
                setUser(parsedUser);
            } catch (error) {
                // Se houver erro ao parsear, limpa localStorage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('current_user');
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            loginAdmin,
            register,
            logout,
            isLoading,
            isAuthenticated,
            isAdmin,
            canManageProducts
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

        // Se receber 403 (Forbidden), lançar erro específico
        if (response.status === 403) {
            throw new Error('Acesso negado. Você não tem permissão para realizar esta ação.');
        }

        return response;
    };

    return authenticatedFetch;
};


// Hook para buscar produtos da API
export const useProducts = () => {
    const API_URL = `${API_BASE_URL}/api/products`;

    const getAllProducts = async () => {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        return response.json();
    };

    const getProductsInStock = async () => {
        const response = await fetch(`${API_URL}/in-stock`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos em estoque');
        }
        return response.json();
    };

    const getProductById = async (id: number) => {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Produto não encontrado');
        }
        return response.json();
    };

    const getProductsByCategory = async (category: string) => {
        const response = await fetch(`${API_URL}/category/${category}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos por categoria');
        }
        return response.json();
    };

    const getProductsPaginated = async (page = 0, size = 10, sortBy = 'name', sortDir = 'asc') => {
        const response = await fetch(`${API_URL}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos paginados');
        }
        return response.json();
    };

    const searchProducts = async (filters: {
        category?: string;
        inStock?: boolean;
        minPrice?: number;
        maxPrice?: number;
        name?: string;
        page?: number;
        size?: number;
    }) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        const response = await fetch(`${API_URL}/search?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Erro ao buscar produtos');
        }
        return response.json();
    };

    return {
        getAllProducts,
        getProductsInStock,
        getProductById,
        getProductsByCategory,
        getProductsPaginated,
        searchProducts
    };
};

// Hook específico para operações de produtos (apenas para admins)
export const useProductManagement = () => {
    const { canManageProducts } = useAuth();
    const authenticatedFetch = useAuthenticatedFetch();
    const API_URL = `${API_BASE_URL}/api/products`;

    const createProduct = async (productData: any) => {
        if (!canManageProducts()) {
            throw new Error('Apenas administradores podem criar produtos.');
        }

        const response = await authenticatedFetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao criar produto');
        }

        return response.json();
    };

    const updateProduct = async (id: number, productData: any) => {
        if (!canManageProducts()) {
            throw new Error('Apenas administradores podem atualizar produtos.');
        }

        const response = await authenticatedFetch(`${API_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao atualizar produto');
        }

        return response.json();
    };

    const deleteProduct = async (id: number) => {
        if (!canManageProducts()) {
            throw new Error('Apenas administradores podem deletar produtos.');
        }

        const response = await authenticatedFetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao deletar produto');
        }

        return true;
    };

    const updateStock = async (id: number, quantity: number) => {
        if (!canManageProducts()) {
            throw new Error('Apenas administradores podem atualizar estoque.');
        }

        const response = await authenticatedFetch(`${API_URL}/${id}/stock?quantity=${quantity}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao atualizar estoque');
        }

        return response.json();
    };

    return {
        createProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        canManageProducts: canManageProducts()
    };
};