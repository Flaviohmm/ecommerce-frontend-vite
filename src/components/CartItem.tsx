
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
    item: {
        id: number;
        name: string;
        price: number;
        image: string;
        quantity: number;
    };
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
    const { updateQuantity, removeItem } = useCart();

    const handleIncrement = () => {
        updateQuantity(item.id, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }
    };

    const handleRemove = () => {
        removeItem(item.id);
    };

    return (
        <Card className="overflow-hidden border-0 shadow-md bg-white dark:bg-gray-950">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Imagem do produto */}
                    <div className="flex-shrink-0">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                    </div>

                    {/* Informações do produto */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.name}</h3>
                        <p className="text-lg font-bold text-blue-600 mt-1">
                            R$ {item.price.toFixed(2)}
                        </p>
                    </div>

                    {/* Controle de quantidade */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDecrement}
                            className="w-8 h-8 p-0 rounded-full"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>

                        <span className="w-12 text-center font-semibold">
                            {item.quantity}
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleIncrement}
                            className="w-8 h-8 p-0 rounded-full"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Subtotal e remover */}
                    <div className="text-right">
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-200">
                            R$ {(item.price * item.quantity).toFixed(2)}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemove}
                            className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-300"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};