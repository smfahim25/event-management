import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import axios from "axios";

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

const API_BASE = import.meta.env.VITE_API_URL;

export const useAuthStore = create((set) => ({
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,
  users: [],

  register: async (name, email, phone, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "Registration failed");
        throw new Error(data.message || "Registration failed");
      }
      toast.success(
        "Registration successfull & Check your email for verification"
      );
      return data.data;
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
      toast.success("Login successful");
      if (role === "admin" || role === "superAdmin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/";
      }
      set({ user: userData, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.success("Profile updated successfully");
      set({ user: result.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
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
      toast.error(err.message);
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
      toast.success("User created successfully");
      return data.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
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
      toast.success("User updated successfully");
      return data.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
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
      toast.success("User deleted successfully");
      set({ loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message);
    }
  },
  updatePreferences: async ({ userId, preferences }) => {
    if (!userId) {
      throw new Error("No user id found");
    }

    try {
      const response = await axios.patch(
        `${API_BASE}/users/me/preferences`,
        {
          userId: userId,
          preference: preferences,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating preferences:", error);
      throw error;
    }
  },
}));
