import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const useBlogStore = create((set, get) => ({
  categories: [],
  blogs: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blog-categories`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await fetch(`${API_URL}/blog-categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await fetch(`${API_URL}/blog-categories`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await fetch(`${API_URL}/blog-categories/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
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

  deleteCategory: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blog-categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
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

  createBlog: async (formData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blogs`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      toast.success("Blog created successfully");
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Create blog failed:", error);
      toast.error(error.message || "Failed to create blog");
    }
  },

  fetchBlogs: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blogs?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      set({
        blogs: data.blogs || [],
        meta: data.meta || {},
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || "Failed to fetch blogs");
    }
  },

  getBlogById: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blogs/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ loading: false });
      return data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || "Failed to fetch blog by ID");
      return null;
    }
  },

  getBlogBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blogs/slug/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || "Failed to fetch blog by slug");
      return null;
    }
  },
  updateBlog: async (id, formData) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      toast.success("Blog updated successfully");
      get().fetchBlogs();
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Update blog failed:", error);
      toast.error(error.message || "Failed to update blog");
    }
  },

  deleteBlog: async (id) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const res = await fetch(`${API_URL}/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      toast.success("Blog deleted successfully");
      get().fetchBlogs(); // refresh blogs list
      set({ loading: false });
      return data;
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || "Failed to delete blog");
      return null;
    }
  },

  uploadBlogImage: async (imageFile) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/blogs/blog-image`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      toast.success("Image uploaded successfully");
      set({ loading: false });
      return data;
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error(error.message || "Image upload failed");
    }
  },
}));
