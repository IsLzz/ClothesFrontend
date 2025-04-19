// 导入所有API服务
import userService from './services/userService'
import clothesService from './services/clothesService'
import orderService from './services/orderService'
import rentalService from './services/rentalService'
import fileService from './services/fileService'
import request from "./request";
import type { ApiResponse, Clothing, Order, OrderItem, PageResponse, User } from '@/types';

// 设置基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// 导出API服务
export {
  userService,
  clothesService,
  orderService,
  rentalService,
  fileService
}

/**
 * 服装管理接口
 */

// 分页查询服装
export const getClothes = (page = 1, pageSize = 10) => {
  return request.get<ApiResponse<Clothing[]>>('/clothes', {
    params: { page, pageSize }
  });
};

// 根据ID查询服装
export const getClothingById = (id: number) => {
  return request.get<ApiResponse<Clothing>>(`/clothes/${id}`);
};

// 按分类查询服装
export const getClothingByCategory = (category: string, page = 1, pageSize = 10) => {
  return request.get<ApiResponse<Clothing[]>>(`/clothes/category/${category}`, {
    params: { page, pageSize }
  });
};

// 搜索服装
export const searchClothing = (keyword: string, page = 1, pageSize = 10) => {
  return request.get<ApiResponse<Clothing[]>>('/clothes/search', {
    params: { keyword, page, pageSize }
  });
};

// 创建服装
export const createClothing = (clothingData: Partial<Clothing>) => {
  return request.post<ApiResponse<Clothing>>('/clothes', clothingData);
};

// 更新服装
export const updateClothing = (id: number, clothingData: Partial<Clothing>) => {
  return request.put<ApiResponse<Clothing>>(`/clothes/${id}`, clothingData);
};

// 删除服装
export const deleteClothing = (id: number) => {
  return request.delete<ApiResponse<boolean>>(`/clothes/${id}`);
};

/**
 * 订单管理接口
 */

// 创建订单
interface CreateOrderRequest {
  userId: number;
  orderItems: {
    clothesId: number;
    quantity: number;
    startDate: string;
    endDate: string;
  }[];
}

export const createOrder = (orderData: CreateOrderRequest) => {
  return request.post<ApiResponse<Order>>('/orders', orderData);
};

// 分页查询所有订单（管理员）
export const getOrders = (page = 1, pageSize = 10) => {
  return request.get<ApiResponse<PageResponse<Order>>>('/orders', {
    params: { page, pageSize }
  });
};

// 查询用户订单
export const getUserOrders = (userId: number, page = 1, pageSize = 10) => {
  return request.get<ApiResponse<PageResponse<Order>>>(`/orders/user/${userId}`, {
    params: { page, pageSize }
  });
};

// 根据ID查询订单
export const getOrderById = (id: number) => {
  return request.get<ApiResponse<Order>>(`/orders/${id}`);
};

// 取消订单
export const cancelOrder = (id: number) => {
  return request.put<ApiResponse<boolean>>(`/orders/${id}/cancel`);
};

// 完成订单
export const completeOrder = (id: number) => {
  return request.put<ApiResponse<boolean>>(`/orders/${id}/complete`);
};

// 更新订单状态
export const updateOrderStatus = (id: number, status: string) => {
  return request.put<ApiResponse<boolean>>(`/orders/${id}/status`, null, {
    params: { status }
  });
};

/**
 * 租赁管理接口
 */

// 获取用户的所有租赁记录
export const getUserRentals = (userId: number) => {
  return request.get<ApiResponse<any[]>>(`/rentals/user/${userId}`);
};

// 查询所有未归还的租赁记录
export const getNotReturnedRentals = () => {
  return request.get<ApiResponse<any[]>>('/rentals/not-returned');
};

// 归还服装
export const returnRental = (id: number, returnDate: string, lateFee?: number) => {
  return request.put<ApiResponse<boolean>>(`/rentals/${id}/return`, null, {
    params: { returnDate, lateFee }
  });
};

/**
 * 用户管理接口
 */

// 分页查询用户列表
export const getUsers = (page = 1, pageSize = 10) => {
  return request.get<ApiResponse<PageResponse<User>>>('/users', {
    params: { page, pageSize }
  });
};

// 根据ID查询用户
export const getUserById = (id: number) => {
  return request.get<ApiResponse<User>>(`/users/${id}`);
};

// 更新用户信息
export const updateUser = (id: number, userData: Partial<User>) => {
  return request.put<ApiResponse<User>>(`/users/${id}`, userData);
};

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete<ApiResponse<boolean>>(`/users/${id}`);
};

/**
 * 文件管理接口
 */

// 上传图片
export const uploadImage = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return request.post<ApiResponse<{
    filename: string;
    size: number;
    contentType: string;
    url: string;
  }>>('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 导出默认对象
export default {
  user: userService,
  clothes: clothesService,
  order: orderService,
  rental: rentalService,
  file: fileService
} 