import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, ShoppingBag } from "lucide-react";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { loginAdmin, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await loginAdmin(email, password);
            navigate('/admin');
        } catch (error) {
            setError('Credenciais de administrador inválidas');
            console.error('Erro de autenticação admin:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-zinc-100 dark:from-slate-900 dark:via-gray-900 dark:to-zinc-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ShoppingBag className="w-8 h-8 text-orange-500" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">E-Commerce</h1>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-6 h-6 text-orange-500" />
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Painel Adminstrativo</h2>
                    </div>
                    <p className="text-gray-400">Acesso restrito para adminstradores</p>
                </div>

                <Card className="shadow-2xl border border-gray-300 bg-gray-200/90 dark:border-gray-700 dark:bg-gray-800/90 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                            <Shield className="w-6 h-6 text-orange-500" />
                            Login Admin
                        </CardTitle>
                        <CardDescription className="text-gray-700 dark:text-gray-300">
                            Entre com suas credenciais de administrador
                        </CardDescription>
                        {error && (
                            <div className="bg-red-200/20 dark:bg-red-900/50 border border-red-500 dark:text-red-300 text-red-600 px-4 py-3 rounded mt-2">
                                {error}
                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-800 dark:text-gray-200">Email do Administrador</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 px-4 rounded-xl bg-gray-300 border-gray-400 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:border-orange-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-800 dark:text-gray-200">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite sua senha de admin"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 px-4 pr-12 rounded-xl bg-gray-300 border-gray-400 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-400 focus:border-orange-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                            >
                                {isLoading ? 'Entrando...' : 'Entrar como Admin'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                            >
                                ← Voltar para login de cliente
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminLogin;