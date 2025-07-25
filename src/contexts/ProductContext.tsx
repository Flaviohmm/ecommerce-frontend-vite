import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, PageResponse } from "@/types/Product";
import { productService, ProductSearchParams } from "@/services/productService";
import { toast } from "sonner";

interface ProductContextType {
    products: Product[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    getProduct: (id: number) => Product | undefined;
    searchProducts: (params: ProductSearchParams) => Promise<void>;
    loadProducts: () => Promise<void>;
    updateStock: (id: number, quantity: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) { 
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const productsData = await productService.getAllProducts();
            setProducts(productsData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const addProduct = async (productData: Omit<Product, 'id'>) => {
        try {
            setLoading(true);
            const newProduct = await productService.createProduct(productData);
            setProducts(prev => [...prev, newProduct]);
            toast.success('Produto adicionado com sucesso!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar produto';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: number, productData: Partial<Product>) => {
        try {
            setLoading(true);
            const updatedProduct = await productService.updateProduct(id, productData as any);
            setProducts(prev => 
                prev.map(product => 
                    product.id === id ? updatedProduct : product
                )
            );
            toast.success('Produto atualizado com sucesso!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar produto';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            setLoading(true);
            await productService.deleteProduct(id);
            setProducts(prev => prev.filter(product => product.id !== id));
            toast.success('Produto deletado com sucesso!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar produto';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (id: number, quantity: number) => {
        try {
            setLoading(true);
            const updatedProduct = await productService.updateStock(id, quantity);
            setProducts(prev => 
                prev.map(product =>
                    product.id === id ? updatedProduct : product
                )
            );
            toast.success('Estoque atualizado com sucesso!');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar estoque';
            setError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (params: ProductSearchParams) => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.searchProducts(params);
            setProducts(response.content);
            setTotalPages(response.totalPages);
            setCurrentPage(response.number);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar produtos';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getProduct = (id: number) => {
        return products.find(product => product.id === id);
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            totalPages,
            currentPage,
            addProduct,
            updateProduct,
            deleteProduct,
            getProduct,
            searchProducts,
            loadProducts,
            updateStock
        }}>
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
}