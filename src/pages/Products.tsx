
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import { SearchHeader } from "@/components/SearchHeader";
import { Loader2 } from "lucide-react";

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

// Mock data como fallback caso a API falhe
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
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
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
            setFilteredProducts(products);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err);
            setError('Não foi possível carregar os produtos. Usando dados de exemplo.');

            // Usar produtos mock como fallback
            setAllProducts(mockProducts);
            setFilteredProducts(mockProducts);
        } finally {
            setLoading(false);
        }
    };

    // Buscar produtos ao carregar o componente
    useEffect(() => {
        fetchProducts();
    }, []);

    const handleFiltersChange = (filters: any) => {
        let filtered = allProducts;

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
        let filtered = allProducts;

        if (term) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(term.toLowerCase()) ||
                product.description.toLowerCase().includes(term.toLowerCase())
            );
        }

        // Reaplicar outros filtros se necessário
        setFilteredProducts(filtered);
    };

    const handleSortChange = (sortBy: any) => {
        let sorted = [...filteredProducts];

        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Manter ordem original
                break;
        }

        setFilteredProducts(sorted);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
                <SearchHeader onSearch={handleSearch} />
                <div className="container mx-auto px-4 py-20">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Carregando produtos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
            <SearchHeader onSearch={handleSearch} />

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                            {error}
                        </p>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filtros - Sidebar */}
                    <div className="lg:w-1/4">
                        <ProductFilters onFiltersChange={handleFiltersChange} />
                    </div>

                    {/* Grid de Produtos */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                Produtos ({filteredProducts.length})
                            </h2>
                            <select
                                className="px-4 py-2 border border-gray-200 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={(e) => handleSortChange(e.target.value)}
                            >
                                <option value="">Ordenar por</option>
                                <option value="price-low">Menor preço</option>
                                <option value="price-high">Maior preço</option>
                                <option value="rating">Melhor avaliação</option>
                                <option value="name">Nome A-Z</option>
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
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setFilteredProducts(allProducts);
                                    }}
                                    className="mt-4 text-blue-600 hover:text-blue-800 underline"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;