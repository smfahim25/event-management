import { create } from "zustand";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;

export const useFaqStore = create((set, get) => ({
  token: Cookies.get("accessToken") || "",

  getHeaders: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  faqs: [],
  currentFaq: null,

  fetchFaqs: async () => {
    try {
      const response = await axios.get(`${API_BASE}/faq`, {
        headers: get().getHeaders(),
      });
      set({ faqs: response.data.data });
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    }
  },

  getFaqById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE}/faq/${id}`, {
        headers: get().getHeaders(),
      });
      set({ currentFaq: response.data });
    } catch (error) {
      console.error("Failed to get FAQ:", error);
    }
  },

  createFaq: async (faqData) => {
    try {
      const response = await axios.post(`${API_BASE}/faq/`, faqData, {
        headers: {
          ...get().getHeaders(),
          "Content-Type": "application/json",
        },
      });
      get().fetchFaqs();
      toast.success("Created faq successfully");
      return response.data;
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      toast.error("Failed to create FAQ:", error);
    }
  },

  updateFaq: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_BASE}/faq/${id}`, updatedData, {
        headers: {
          ...get().getHeaders(),
          "Content-Type": "application/json",
        },
      });
      get().fetchFaqs();
      toast.success("Faq updated successfully");
      return response.data;
    } catch (error) {
      console.error("Failed to update FAQ:", error);
    }
  },

  deleteFaq: async (id) => {
    try {
      await axios.delete(`${API_BASE}/faq/${id}`, {
        headers: get().getHeaders(),
      });
      get().fetchFaqs();
      toast.success("Faq deleted successfully");
    } catch (error) {
      console.error("Failed to delete FAQ:", error);
    }
  },
}));
