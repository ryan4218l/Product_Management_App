import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { CartItem, Product } from "../types";
import { toast } from "react-hot-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: number) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  const addToCart = (product: Product, quantity: number = 1): void => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevItems;
        }

        toast.success(`Updated ${product.name} quantity to ${newQuantity}`);
        return prevItems.map((item) => (item.product.id === product.id ? { ...item, quantity: newQuantity } : item));
      } else {
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`);
          return prevItems;
        }

        toast.success(`Added ${product.name} to cart`);
        return [...prevItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: number): void => {
    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.product.id === productId);
      if (item) {
        toast.success(`Removed ${item.product.name} from cart`);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number): void => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.product.id === productId);
      if (!item) return prevItems;

      if (quantity > item.product.stock) {
        toast.error(`Only ${item.product.stock} items available in stock`);
        return prevItems;
      }

      toast.success(`Updated ${item.product.name} quantity to ${quantity}`);
      return prevItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
    });
  };

  const clearCart = (): void => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = (): number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId: number): boolean => {
    return cartItems.some((item) => item.product.id === productId);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
