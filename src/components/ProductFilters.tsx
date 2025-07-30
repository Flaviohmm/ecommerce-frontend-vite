
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

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

interface ProductFiltersProps {
    onFiltersChange: (filters: any) => void;
}

// Função para formatar preço no padrão brasileiro
const formatBRL = (value: number): string => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange }) => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 20000]);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('auth_token');

    // Função para buscar produtos do backend
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError('');

            // Buscar produtos dísponível
            const response = await fetch('http://localhost:8080/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }

            const products = await response.json();
            setAllProducts(products);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            setError('Não foi possível carregar os produtos. Usando dados de exemplo.');
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: '', name: 'Todas as Categorias' },
        { id: 'Electronics', name: 'Eletrônicos' },
        { id: 'Fashion', name: 'Moda' },
        { id: 'Home', name: 'Casa' },
        { id: 'Sports', name: 'Esportes' },
        { id: 'Books', name: 'Livros' },
        { id: 'Beauty', name: 'Beleza' },
    ];

    const applyFilters = () => {
        const filters = {
            category: selectedCategory,
            priceRange: priceRange,
            inStock: inStockOnly,
        };
        onFiltersChange(filters);
    };

    const clearFilters = () => {
        // Resetar todos os estados dos filtros
        setInStockOnly(false);

        // Aplicar filtros limpos imediatamente
        const clearedFilters = {
            inStock: false,
        };
        onFiltersChange(clearedFilters);
    };

    React.useEffect(() => {
        fetchProducts();
    }, []); // Buscar produtos apenas uma vez na montagem

    React.useEffect(() => {
        applyFilters();
    }, [selectedCategory, priceRange, inStockOnly]); // Aplicar filtros quando houver mudanças

    return (
        <Card className="sticky top-4 shadow-lg border-0 bg-white dark:bg-gray-950">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
                    <Filter className="w-5 h-5" />
                    Filtros
                </CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-gray-600 hover:text-red-600"
                >
                    <X className="w-4 h-4 mr-1" />
                    Limpar
                </Button>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Filtro de Categoria */}
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Categoria</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.id}
                                    checked={selectedCategory === category.id}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 dark:bg-gray-950"
                                />
                                <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filtro de Preço */}
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-300 mb-3">Faixa de Preço</h3>
                    <div className="px-2">
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={20000}
                            min={0}
                            step={10}
                            className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>{formatBRL(priceRange[0])}</span>
                            <span>{formatBRL(priceRange[1])}</span>
                        </div>
                    </div>
                </div>

                {/* Filtro de Disponibilidade */}
                <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Disponibilidade</h3>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="inStock"
                            checked={inStockOnly}
                            onCheckedChange={(checked) => setInStockOnly(checked === true)}
                        />
                        <label htmlFor="inStock" className="text-gray-700 cursor-pointer">
                            Apenas produtos em estoque
                        </label>
                    </div>
                </div>

                {/* Resumo dos Filtros */}
                <div className="pt-4 border-t">
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Filtros Ativos:</h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div>Categoria: {categories.find(c => c.id === selectedCategory)?.name}</div>
                        <div>Preço: {formatBRL(priceRange[0])} - R$ {formatBRL(priceRange[1])}</div>
                        {inStockOnly && <div>Apenas em estoque</div>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
