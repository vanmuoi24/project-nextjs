import { apiClient } from "./axios";
import type { CategoryResponse } from "./categories";

/**
 * Khớp với backend entity Product (TypeORM):
 * entities/product.entity.ts
 */
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  /** Backward compatibility - string slug hoặc tên category */
  category: string;
  /** Nếu API trả về relation (join) */
  categoryRelation?: CategoryResponse | null;
  /** DB column: image_url */
  imageUrl: string;
  /** ISO date string từ JSON */
  createdAt: string;
  /** ISO date string từ JSON */
  updatedAt: string;
}

/**
 * Khớp với backend CreateProductDto
 */
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
  categoryId?: number;
  category?: string;
}

/**
 * Khớp với backend UpdateProductDto (partial)
 */
export type UpdateProductDto = Partial<CreateProductDto>;

export interface ProductListParams {
  page?: number;
  limit?: number;
  category?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  q?: string;
}

/**
 * Khớp với NestJS ProductsController
 */
export const productsApi = {
  /** GET /products - findAll */
  getAll: (params?: ProductListParams) =>
    apiClient.get<ProductResponse[]>("/products", { params }),

  /** GET /products/search?q= - searchProducts */
  search: (query: string) =>
    apiClient.get<ProductResponse[]>("/products/search", { params: { q: query } }),

  /** GET /products/:id - findOne */
  getById: (id: number) =>
    apiClient.get<ProductResponse>(`/products/${id}`),

  /** POST /products - create */
  create: (createProductDto: CreateProductDto) =>
    apiClient.post<ProductResponse>("/products", createProductDto),

  /** PATCH /products/:id - update */
  update: (id: number, updateProductDto: UpdateProductDto) =>
    apiClient.patch<ProductResponse>(`/products/${id}`, updateProductDto),

  /** DELETE /products/:id - remove */
  remove: (id: number) =>
    apiClient.delete<void>(`/products/${id}`),
};
