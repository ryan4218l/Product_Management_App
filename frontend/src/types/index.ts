export interface User {
  id: number;
  email: string;
  role: "admin" | "customer";
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  rating: number;
  ratingCounter: number;
  features?: string[];
  specifications?: { 
    [key: string]: string | string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentMethod {
  type: 'credit-card' | 'paypal' | 'bank-transfer';
  cardNumber?: string;
  cardName?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface Order {
 id: string;
  userId: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  product?: Product;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface LoginData {
  email: string;
  password: string;
  role: "admin" | "customer";
}

export interface RegisterData {
  email: string;
  password: string;
  role?: "admin" | "customer";
}

export interface ApiResponse<T> {
  data?: T;
  message: string;
  success: boolean;
}
