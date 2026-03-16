import { apiClient } from "./axios";

/**
 * Khớp với backend entity Category (TypeORM):
 * entities/category.entity.ts
 */
export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  /** Nullable trong DB */
  thumbnail: string | null;
  /** DB: is_active tinyint default 1 */
  is_active: boolean;
  /** Nếu API trả về relation (join) */
  parent?: CategoryResponse | null;
  /** ID cha, khi API không embed parent */
  parent_id?: number | null;
  /** Category con */
  children?: CategoryResponse[];
  /** ISO date string từ JSON */
  created_at: string;
  /** ISO date string từ JSON */
  updated_at: string;
}

/**
 * Khớp với backend CreateCategoryDto
 */
export interface CreateCategoryDto {
  name: string;
  slug: string;
  thumbnail?: string | null;
  parent_id?: number | null;
  is_active?: boolean;
}

/**
 * Khớp với backend UpdateCategoryDto (partial)
 */
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

/**
 * Khớp với NestJS CategoriesController
 */
export const categoriesApi = {
  /** GET /categories - findAll */
  getAll: () =>
    apiClient.get<CategoryResponse[]>("/categories"),

  /** GET /categories/:id - findOne */
  getById: (id: number) =>
    apiClient.get<CategoryResponse>(`/categories/${id}`),

  /** POST /categories - create */
  create: (dto: CreateCategoryDto) =>
    apiClient.post<CategoryResponse>("/categories", dto),

  /** PATCH /categories/:id - update */
  update: (id: number, dto: UpdateCategoryDto) =>
    apiClient.patch<CategoryResponse>(`/categories/${id}`, dto),

  /** DELETE /categories/:id - remove */
  remove: (id: number) =>
    apiClient.delete<void>(`/categories/${id}`),
};
