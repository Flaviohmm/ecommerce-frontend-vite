
import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
    id: string;
    email: string;
    name?: string;
}

interface StoredUser extends User {
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulação de "banco de dados" em localStorage para usuários registrados
const getStoredUsers = (): StoredUser[] => {
    const users = localStorage.getItem('registered_users');
    return users ? JSON.parse(users) : [];
};

const saveUser = (user: User, password: string) => {
    const users = getStoredUsers();
    const userWithPassword: StoredUser = { ...user, password };
    const existingIndex = users.findIndex(u => u.email === user.email);

    if (existingIndex >= 0) {
        users[existingIndex] = userWithPassword;
    } else {
        users.push(userWithPassword);
    }

    localStorage.setItem('registered_users', JSON.stringify(users));
};

const findUser = (email: string, password: string): User | null => {
    const users = getStoredUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword as User;
    }

    return null;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Simulação de login - verificar usuários registrados
            await new Promise(resolve => setTimeout(resolve, 1000));

           const foundUser = findUser(email, password);

           if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('current_user', JSON.stringify(foundUser));
           } else {
            throw new Error('Credenciais inválidas');
           }
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            // Simulação de registro - salvar usuário para login posterior
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newUser: User = {
                id: Date.now().toString(),
                email: email,
                name: name
            };

            // Salvar usuário para login posterior (não loga automaticamente)
            saveUser(newUser, password);
            
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('current_user');
    };

    // Verificar se há usuário salvo no localStorage ao inicializar
    React.useEffect(() => {
        const savedUser = localStorage.getItem('current_user');
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
