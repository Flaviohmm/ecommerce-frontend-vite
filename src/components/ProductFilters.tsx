
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

interface ProductFiltersProps {
    onFiltersChange: (filters: any) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({ onFiltersChange }) => {
    const [selectedCategory, setSelectCategory] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 2000]);
    const [inStockOnly, setInStockOnly] = useState(false);

    const categories = [
        { id: 'all', name: 'Todas as Categorias' },
        { id: 'electronics', name: 'Eletrônicos' },
        { id: 'fashion', name: 'Moda' },
        { id: 'home', name: 'Casa' },
        { id: 'sports', name: 'Esportes' },
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
        setSelectCategory('all');
        setPriceRange([0, 2000]);
        setInStockOnly(false);
        onFiltersChange({
            category: 'all',
            priceRange: [0, 2000],
            inStock: false,
        });
    };

    React.useEffect(() => {
        applyFilters();
    }, [selectedCategory, priceRange, inStockOnly]);

    return (
        <Card className="sticky top-4 shadow-lg border-0 bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-800">
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
                    <h3 className="font-semibold text-gray-800 mb-3">Categoria</h3>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="text"
                                    name="category"
                                    value={category.id}
                                    checked={selectedCategory === category.id}
                                    onChange={(e) => setSelectCategory(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Filtro de Preço */}
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Faixa de Preço</h3>
                    <div className="px-2">
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={2000}
                            min={0}
                            step={10}
                            className="mb-4"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>R$ {priceRange[0]}</span>
                            <span>R$ {priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                {/* Filtro de Disponibilidade */}
                <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Disponibilidade</h3>
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
                    <h4 className="font-medium text-gray-800 mb-2">Filtros Ativos:</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                        <div>Categoria: {categories.find(c => c.id === selectedCategory)?.name}</div>
                        <div>Preço: R$ {priceRange[0]} - R$ {priceRange[1]}</div>
                        {inStockOnly && <div>Apenas em estoque</div>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
