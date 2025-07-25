import { Product, ProductFilters } from "@/types/Product";
import { apiService } from "@/config/api";

export interface ProductSearchParams extends ProductFilters {}

export const productService = apiService;