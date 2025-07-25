// services/api.ts
import { PageResponse, Product, ProductDTO, ProductFilters } from "@/types/Product";

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
    private baseURL: string;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // GET - Listar todos os produtos
    async getAllProducts(): Promise<Product[]> {
        return this.request<Product[]>('/products');
    }

    // GET - Listar produtos em estoque
    async getProductsInStock(): Promise<Product[]> {
        return this.request<Product[]>('/products/in-stock');
    }

    // GET - Buscar produto por ID
    async getProductById(id: number): Promise<Product> {
        return this.request<Product>(`/products/${id}`);
    }

    // GET - Buscar produtos por categoria
    async getProductsByCategory(category: string): Promise<Product[]> {
        return this.request<Product[]>(`/products/category/${encodeURIComponent(category)}`);
    }

    // GET - Buscar produtos com paginação
    async getProductsPaginated(
        page: number = 0,
        size: number = 10,
        sortBy: string = 'name',
        sortDir: string = 'asc'
    ): Promise<PageResponse<Product>> {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            sortBy,
            sortDir,
        });

        return this.request<PageResponse<Product>>(`/products/paginated?${params}`);
    }

    // GET - Buscar produtos com filtros
    async searchProducts(filters: ProductFilters): Promise<PageResponse<Product>> {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.request<PageResponse<Product>>(`/products/search?${params}`);
    }

    // POST - Criar produto
    async createProduct(product: ProductDTO): Promise<Product> {
        return this.request<Product>('/products', {
            method: 'POST',
            body: JSON.stringify(product),
        });
    }

    // PUT - Atualizar produto
    async updateProduct(id: number, product: ProductDTO): Promise<Product> {
        return this.request<Product>(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        });
    }

    // DELETE - Deletar produto
    async deleteProduct(id: number): Promise<{ message: string }> {
        return this.request<{ message: string }>(`/products/${id}`, {
            method: 'DELETE',
        });
    }

    // PATCH - Atualizar estoque
    async updateStock(id: number, quantity: number): Promise<Product> {
        const params = new URLSearchParams({ quantity: quantity.toString() });
        return this.request<Product>(`/products/${id}/stock?${params}`, {
            method: 'PATCH',
        });
    }
}

export const apiService = new ApiService();