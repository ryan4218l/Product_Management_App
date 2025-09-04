export interface UserDto {
  id: number;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDto {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDto {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: Date;
}