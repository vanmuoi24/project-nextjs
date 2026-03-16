import { apiClient } from "./axios";

/** Trạng thái đơn hàng thường dùng */
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipping"
  | "delivered"
  | "cancelled";

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName?: string;
  quantity: number;
  price: number;
  /** price * quantity */
  subtotal?: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  userEmail?: string;
  userName?: string;
  /** Địa chỉ giao hàng */
  shippingAddress?: string;
  phone?: string;
  status: OrderStatus;
  total: number;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

/**
 * API đơn hàng (admin / orders backend)
 */
export const ordersApi = {
  getAll: (params?: OrderListParams) =>
    apiClient.get<OrderResponse[]>("/orders", { params }),

  getById: (id: number) =>
    apiClient.get<OrderResponse>(`/orders/${id}`),

  updateStatus: (id: number, status: OrderStatus) =>
    apiClient.patch<OrderResponse>(`/orders/${id}`, { status }),
};
