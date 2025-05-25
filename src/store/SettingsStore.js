import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;

export const useSettingsStore = create((set, get) => ({
  token: Cookies.get("accessToken") || "",
  loading: false,
  error: null,
  settings: null,
  policy: null,
  adminStats: null,

  setLoading: (value) => set({ loading: value }),
  setError: (error) => set({ error }),

  getHeaders: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  fetchAdminStats: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/settings/admin-stats`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      set({ adminStats: data.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchPolicy: async (page = "privacyPolicy") => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/settings/policy?page=${page}`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      set({ policy: data.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updatePolicy: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/settings/policy/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...get().getHeaders(),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      await get().fetchPolicy();
      return data;
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSettings: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      set({ settings: data.data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/settings/`, {
        method: "PATCH",
        headers: get().getHeaders(),
        body: formData,
      });
      const data = await res.json();
      toast.success("Settings updated successfully");
      return data;
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },
  updateCommission: async (eventId, commission) => {
    set({ loading: true, error: null, success: false });

    try {
      console.log(eventId);
      const response = await fetch(`${API_BASE}/events/${eventId}/commission`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...get().getHeaders() },
        body: JSON.stringify({ platformCommission: commission }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update commission");
      }

      set({ loading: false, success: true });
    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },
}));
