import { api } from "./api";
import { Product } from "../types";

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await api.post("/products", productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
