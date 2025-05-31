import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://api.lessortiesdediane.com/api/v1";

const useNewsletterStore = create((set, get) => ({
  token: Cookies.get("accessToken") || "",

  getHeaders: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  subscribe: async (email) => {
    try {
      const res = await axios.post(
        `${API_BASE}/newsletter/subscribe`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            ...get().getHeaders(),
          },
        }
      );
      toast.success("Successfully subscribed to newsletter!");
      return res.data;
    } catch (err) {
      console.error("Subscribe error:", err.response?.data || err.message);
      throw err;
    }
  },

  getNewsletter: async () => {
    try {
      const res = await axios.get(`${API_BASE}/newsletter`, {
        headers: {
          "Content-Type": "application/json",
          ...get().getHeaders(),
        },
      });

      return res.data;
    } catch (err) {
      console.error("Get newsletter error:", err.response?.data || err.message);
      throw err;
    }
  },

  unsubscribe: async (email) => {
    try {
      const res = await axios.delete(
        `${API_BASE}/newsletter/unsubscribe/${email}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...get().getHeaders(),
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Unsubscribe error:", err.response?.data || err.message);
      throw err;
    }
  },
}));

export default useNewsletterStore;
