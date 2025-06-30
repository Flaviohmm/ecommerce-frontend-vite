
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShoppingBag } from "lucide-react";

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isLogin) {
                await login(email, password);
                navigate('/products')
            } else {
                await register(name, email, password);
                setRegistrationSuccess(true);
                setIsLogin(true);
                setName('');
                setPassword('');
                console.log('Conta criada com sucesso! Agora faça login.');
            }
        } catch (error) {
            console.error('Erro de autenticação:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">E-Commerce</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Sua loja online favorita</p>
                </div>

                <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-950/85 backdrop-blur-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {isLogin ? 'Entrar' : 'Criar Conta'}
                        </CardTitle>
                        <CardDescription>
                            {isLogin
                                ? 'Faça login para continuar suas compras'
                                : 'Crie sua conta para começar a comprar'
                            }
                        </CardDescription>
                        {registrationSuccess && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-2">
                                Conta criada com sucesso! Agora faça login.
                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-12 px-4 rounded-xl"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-12 px-4 rounded-xl"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-12 px-4 pr-12 rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                            >
                                {isLogin ? 'Entrar' : 'Criar Conta'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                            </p>
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setRegistrationSuccess(false);
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold mt-1 transition-colors"
                            >
                                {isLogin ? 'Criar conta' : 'Fazer login'}
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
