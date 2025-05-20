import { create } from "zustand";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = `${import.meta.env.VITE_API_URL}/events`;

export const useEventStore = create((set, get) => ({
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  total: 0,

  getAuthHeaders: () => {
    const token = Cookies.get("accessToken");
    return {
      Authorization: `Bearer ${token}`,
    };
  },

  fetchAllEvents: async ({
    searchTerm = "",
    // eventCategory = "",
    page = 1,
    limit = 10,
    sort = "eventDate",
  }) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}`, {
        headers: get().getAuthHeaders(),
        params: {
          searchTerm,
          // eventCategory,
          page,
          limit,
          sort,
        },
      });
      set({
        events: res.data.data || [],
        total: res.data.meta?.total || 0,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchOrganizerEvents: async () => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/organizer`, {
        headers: get().getAuthHeaders(),
      });
      set({ events: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchEventById: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/${id}`, {
        headers: get().getAuthHeaders(),
      });
      set({ selectedEvent: res.data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true });
    try {
      const res = await axios.post(API_BASE, eventData, {
        headers: {
          ...get().getAuthHeaders(),
        },
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateEvent: async (id, updatedData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_BASE}/${id}`, updatedData, {
        headers: get().getAuthHeaders(),
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  updateEventStatus: async (id, statusData) => {
    set({ loading: true });
    try {
      const res = await axios.put(`${API_BASE}/${id}/status`, statusData, {
        headers: {
          ...get().getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });
      set({ loading: false });
      await get().fetchAdminEvents();
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`${API_BASE}/${id}`, {
        headers: get().getAuthHeaders(),
      });
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchAdminEvents: async ({
    searchTerm = "",
    page = 1,
    limit = 50,
    // thisWeek = true,
    sort = "eventDate",
  } = {}) => {
    set({ loading: true });
    try {
      const res = await axios.get(`${API_BASE}/all`, {
        headers: get().getAuthHeaders(),
        params: {
          searchTerm,
          page,
          limit,
          // thisWeek,
          sort,
        },
      });
      set({
        events: res.data.data || [],
        total: res.data.meta?.total || 0,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
