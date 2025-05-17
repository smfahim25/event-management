import { create } from "zustand";
import Cookies from "js-cookie";

const getUserFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem("authUser");
    const role = Cookies.get("role");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (role) {
        user.role = role;
      }
      return user;
    }

    return null;
  } catch {
    return null;
  }
};

const API_BASE = "https://event-management-backend-0401.onrender.com/api/v1";

export const useAuthStore = create((set) => ({
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,
  users: [],

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      const { accessToken, role, ...userData } = result.data;

      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      localStorage.setItem("authUser", JSON.stringify(userData));

      set({ user: userData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("role");
    localStorage.removeItem("authUser");
    set({ user: null });
  },

  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token");

      const res = await fetch(`${API_BASE}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch user");
      }

      localStorage.setItem("authUser", JSON.stringify(result.data));
      set({ user: result.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateUser: async (updateData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("No token");

      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update user");
      }

      localStorage.setItem("authUser", JSON.stringify(result.data));
      set({ user: result.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to get users");
      }

      set({ users: data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");

      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create user");
      }

      set({ loading: false });
      return data.data; // returning created user
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  updateUserById: async (userId, updateData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update user");
      }

      set({ loading: false });
      return data.data;
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteUserById: async (userId) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");

      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
