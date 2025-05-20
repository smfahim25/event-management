import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      set({ categories: data.data || [], loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || "Failed to fetch categories");
    }
  },

  fetchCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set({ loading: false });
      return await res.json();
    } catch (error) {
      console.error("Fetch category failed:", error);
      return null;
    }
  },

  createCategory: async (formData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      get().fetchCategories();
      toast.success("Category created successfully");
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Create failed:", error);
      toast.error(error.message || "Failed to create category");
    }
  },

  updateCategory: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await res.json();
      get().fetchCategories();
      toast.success("Category updated successfully");
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.message || "Failed to update category");
    }
  },

  approveCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/${id}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      get().fetchCategories();
      toast.success("Category approved successfully");
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Approve failed:", error);
      toast.error(error.message || "Failed to approve category");
    }
  },

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      get().fetchCategories();
      toast.success("Category deleted successfully");
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete category");
    }
  },
}));
