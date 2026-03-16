export { apiClient } from "./axios";
export {
  productsApi,
  type ProductResponse,
  type ProductListParams,
  type CreateProductDto,
  type UpdateProductDto,
} from "./products";
export {
  categoriesApi,
  type CategoryResponse,
  type CreateCategoryDto,
  type UpdateCategoryDto,
} from "./categories";
export {
  authApi,
  type UserResponse,
  type LoginDto,
  type RegisterUserDto,
  type LoginResponse,
  UserRole,
} from "./auth";
export {
  ordersApi,
  type OrderResponse,
  type OrderItemResponse,
  type OrderStatus,
  type OrderListParams,
} from "./orders";
export { usersApi } from "./users";
export { getApiErrorMessage, type ApiErrorResponse } from "./types";
