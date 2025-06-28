
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { SearchHeader } from "@/components/SearchHeader";

// Mock data para produtos
const mockProducts = [
    {
        id: 1,
        name: "Smartphone Pro Max",
        price: 1299.99,
        originalPrice: 1499.99,
        image: "/placeholder.svg",
        category: "Electronics",
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
    },
    {
        id: 4,
        name: "Smart Watch",
        price: 299.99,
        originalPrice: 399.99,
        image: "/placeholder.svg",
        category: "Electronics",
        rating: 4.7,
        inStock: false,
        description: "Advanced smartwatch with health monitoring"
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 149.99,
        originalPrice: 199.99,
        image: "/placeholder.svg",
        category: "Home",
        rating: 4.5,
        inStock: true,
        description: "Professional grade coffee maker for perfect brews"
    },
    {
        id: 6,
        name: "Gaming Mouse",
        price: 79.99,
        originalPrice: 99.99,
        image: "/placeholder.svg",
        category: "Electronics",
        rating: 4.9,
        inStock: true,
        description: "High-precision gaming mouse with RGB lighting"
    }
];

const Products = () => {
    const [filteredProducts, setFilteredProducts] = useState(mockProducts);
    const [searchTerm, setSearchTerm] = useState('');

    const handleFiltersChange = (filters: any) => {
        let filtered = mockProducts;

        // Filtrar por categoria
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(product =>
                product.category.toLowerCase() === filters.category.toLowerCase()
            );
        }

        // Filtrar por faixa de preço
        if (filters.priceRange) {
            filtered = filtered.filter(product =>
                product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
            );
        }

        // Filtrar por disponibilidade
        if (filters.inStock) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Filtrar por termo de busca
        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        let filtered = mockProducts;

        if (term) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase()) ||
                product.description.toLowerCase().includes(term.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <SearchHeader onSearch={handleSearch} />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtros - Sidebar */}
                    <div className="lg:w-1/4">
                        <ProductFilters onFiltersChange={handleFiltersChange} />
                    </div>

                    {/* Grid de Produtos */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Produtos ({filteredProducts.length})
                            </h2>
                            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option>Ordenar por</option>
                                <option>Menor preço</option>
                                <option>Maior preço</option>
                                <option>Mais populares</option>
                                <option>Melhor avaliação</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Nenhum produto encontrado com os filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;