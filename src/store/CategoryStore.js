import { create } from "zustand";
import Cookies from "js-cookie";

const API_URL =
  "https://event-management-backend-0401.onrender.com/api/v1/categories";

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
    }
  },

  fetchCategory: async (id) => {
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await res.json();
    } catch (error) {
      console.error("Fetch category failed:", error);
      return null;
    }
  },

  createCategory: async (formData) => {
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
      return data;
    } catch (error) {
      console.error("Create failed:", error);
    }
  },

  updateCategory: async (id, formData) => {
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
      return data;
    } catch (error) {
      console.error("Update failed:", error);
    }
  },

  approveCategory: async (id) => {
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
      return data;
    } catch (error) {
      console.error("Approve failed:", error);
    }
  },

  deleteCategory: async (id) => {
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
      return data;
    } catch (error) {
      console.error("Delete failed:", error);
    }
  },
}));
