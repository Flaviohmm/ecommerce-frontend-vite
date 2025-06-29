
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    inStock: boolean;
    description: string;
}

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { addItem } = useCart();

    const handleAddToCart = () => {
        if (!product.inStock) return;

        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });

        toast.success(`${product.name} adicionado ao carrinho!`);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white dark:bg-gray-900">
            <div className="relative overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />

                {/* Badge de desconto */}
                {discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        -{discount}%
                    </div>
                )}

                {/* Badge de status */}
                {!product.inStock && (
                    <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        Esgotado
                    </div>
                )}

                {/* Botão de favoritos */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
            </div>

            <CardContent className="p-4">
                <div className="mb-2">
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                        {product.category}
                    </span>
                </div>

                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={
                                    `w-4 h-4 
                                    ${i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`
                                }
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                        ({product.rating})
                    </span>
                </div>

                {/* Preços */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        R$ {product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                {/* Botão de compra */}
                <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={
                        `w-full py-3 rounded-xl font-semibold transition-all duration-300 
                        ${product.inStock
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`
                    }
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
            </CardContent>
        </Card>
    );
};
