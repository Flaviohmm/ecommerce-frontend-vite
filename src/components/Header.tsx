
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
    const { items } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <header className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            E-Commerce
                        </h1>
                    </div>

                    {/* Navegação */}
                    <nav className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                            Início
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                            Produtos
                        </button>
                        {user?.role === 'admin' && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                            >
                                Admin
                            </button>
                        )}
                    </nav>

                    {/* Ações do usuário */}
                    <div className="flex items-center gap-4">
                        {/* Botão de tema */}
                        <ThemeToggle />

                        {/* Carrinho */}
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Usuário */}
                        {user ? (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">
                                    Olá, {user.name}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={logout}
                                    className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                                >
                                    Sair
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Entrar
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/admin-login')}
                                    className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950"
                                >
                                    Admin
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
