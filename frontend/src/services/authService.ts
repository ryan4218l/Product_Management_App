import { api } from "./api";
import { LoginData, RegisterData, User } from "../types";

export const authService = {
  login: async (loginData: LoginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
  },

  register: async (registerData: RegisterData) => {
    const response = await api.post("/auth/register", registerData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },
};
