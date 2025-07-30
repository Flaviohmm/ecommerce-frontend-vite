import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Star, Shield, Truck, CreditCard, ArrowRight, Heart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/ProductCard";

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    category: string;
    rating: number;
    inStock: boolean;
    description: string;
    stockQuantity?: number;
}

const Index = () => {
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('auth_token');

    // Funções de navegação simuladas
    const handleNavigateToProducts = () => {
        alert('Navegando para página de produtos...');
    };

    const handleNavigateToLogin = () => {
        alert('Navegando para página de login...');
    };

    // Função para buscar produtos do backend
    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true);
            setError('');

            // Buscar produtos disponível
            const response = await fetch('http://localhost:8080/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const products: Product[] = await response.json();

            // Filtrar apenas produtos em estoque e pegar os 3 primeiros para destaque
            const inStockProducts = products
                .filter(product => product.inStock && product.stockQuantity && product.stockQuantity > 0)
                .slice(0, 3);

            setFeaturedProducts(inStockProducts);
        } catch (err: any) {
            console.error('Erro ao buscar produtos:', err);
            setError('Não foi possível carregar os produtos. Verifique se o servidor está rodando.');

            // Produtos de fallback para demonstração
            setFeaturedProducts([
                {
                    id: 1,
                    name: "Smartphone Pro Max",
                    price: 1299.99,
                    originalPrice: 1499.99,
                    image: "/placeholder.svg",
                    category: "Eletronics",
                    rating: 4.8,
                    inStock: true,
                    description: "Latest flagship smartphone with advanced camera system"
                },
                {
                    id: 2,
                    name: "Wireless Headphones",
                    price: 199.99,
                    originalPrice: 249.99,
                    image: "/placeholder.svg",
                    category: "Electronics",
                    rating: 4.6,
                    inStock: true,
                    description: "Premium noise-cancelling wireless headphones"
                },
                {
                    id: 3,
                    name: "Designer Backpack",
                    price: 89.99,
                    originalPrice: 119.99,
                    image: "/placeholder.svg",
                    category: "Fashion",
                    rating: 4.4,
                    inStock: true,
                    description: "Stylish and functional backpack for everyday use"
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Buscar produtos em destaque ao carregar a página
    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Sua Loja Online
                            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                                Favorita
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
                            Descubra produtos incríveis com os melhores preços e entrega rápida para todo o Brasil
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                onClick={() => navigate('/products')}
                                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                Explorar Produtos
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => navigate('/login')}
                                className="border-white dark:bg-white text-gray-500 hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
                            >
                                Criar Conta
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-300 mb-12">
                        Por que escolher nossa loja?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-950">
                            <CardContent className="pt-6">
                                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Truck className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Entrega Rápida</h3>
                                <p className="text-gray-600 dark:text-gray-300">Entregamos em todo o Brasil com rapidez e segurança</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-950">
                            <CardContent className="pt-6">
                                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Compra Segura</h3>
                                <p className="text-gray-600 dark:text-gray-300">Sua segurança é nossa prioridade, dados protegidos</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-950">
                            <CardContent className="pt-6">
                                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Pagamento Fácil</h3>
                                <p className="text-gray-600 dark:text-gray-300">Várias formas de pagamento para sua comodidade</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Produtos em Destaque */}
            <section className="py-20 bg-white dark:bg-gray-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                            Produtos em Destaque
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Confira nossa seleção especial de produtos com os melhores preços
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600 dark:text-gray-400">Carregando produtos...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
                                <p className="text-yellow-800 dark:text-yellow-200 mb-4">{error}</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Exibindo produtos de exemplo. Verifique se o servidor backend está rodando.
                                </p>
                            </div>
                        </div>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {featuredProducts.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Nenhum produto em destaque disponível no momento.
                            </p>
                        </div>
                    )}

                    <div className="text-center">
                        <Button
                            onClick={() => navigate('/products')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
                        >
                            Ver Todos os Produtos
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Depoimentos */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-200 mb-12">
                        O que nossos clientes dizem
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Maria Silva",
                                rating: 5,
                                comment: "Excelente experiência de compra! Produtos de qualidade e entrega super rápida."
                            },
                            {
                                name: "João Santos",
                                rating: 5,
                                comment: "Atendimento excepcional e preços justos. Já fiz várias compras e sempre satisfeito!"
                            },
                            {
                                name: "Ana Costa",
                                rating: 5,
                                comment: "Site fácil de navegar e produtos exatamente como descritos. Recomendo!"
                            }
                        ].map((testimonial, index) => (
                            <Card key={index} className="p-6 border-0 shadow-lg bg-white dark:bg-gray-900">
                                <CardContent className="pt-6">
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4 italic">"{testimonial.comment}"</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{testimonial.name}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Pronto para começar a comprar?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Cadastre-se agora e aproveite ofertas exclusivas
                    </p>
                    <Button
                        onClick={() => navigate('/login')}
                        className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-300"
                    >
                        Criar Conta Grátis
                        <Heart className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default Index;
