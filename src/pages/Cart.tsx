
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/components/CartItem";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        // Aqui seria integrado com o sistema de pagamento
        alert('Redirecionando para o checkout...');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
                    <p className="text-gray-600 mb-6">Adicione alguns produtos para continuar</p>
                    <Button onClick={() => navigate('/products')} className="bg-blue-600 hover:bg-blue-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Continuar Comprando
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/products')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continuar Comprando
                        </Button>
                        <h1 className="text-3xl font-bold text-gray-800">Carrinho de Compras</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items do Carrinho */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <CartItem key={item.id} item={item} />
                            ))}
                        </div>

                        {/* Resumo do Pedido */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo de Pedido</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>R$ {total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Frete</span>
                                        <span>R$ 15.00</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-xl font-bold text-gray-800">
                                            <span>Total</span>
                                            <span>R$ {(total + 15).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={handleCheckout}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                                    >
                                        Finalizar Compra
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={clearCart}
                                        className="w-full border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        Limpar Carrinho
                                    </Button>
                                </div>

                                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-700 font-medium">
                                        🔒 Compra 100% segura
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        Seus dados estão protegidos com criptografia SSL
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
