export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    inStock: boolean;
    description: string;
    stockQuantity: number;
}

export interface ProductDTO {
    id?: number;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    rating: number;
    inStock: boolean;
    description: string;
    stockQuantity: number;
}

export interface ProductFilters {
    category?: string;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    name?: string;
    page?: number;
    size?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}