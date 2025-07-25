import { useState, useEffect } from "react";
import { Product, ProductFilters, PageResponse } from "@/types/Product";
import { apiService } from "@/config/api";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<String | null>(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getProductsInStock();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
    };
};
