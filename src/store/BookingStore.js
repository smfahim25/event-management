import { create } from "zustand";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_API_URL}/bookings`;

export const useBookingStore = create((set, get) => ({
  token: Cookies.get("accessToken") || "",
  loading: false,
  error: null,

  setLoading: (value) => set({ loading: value }),
  setError: (error) => set({ error }),

  getHeaders: () => {
    const token = get().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  createBooking: async (bookingData) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: {
          ...get().getHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to create booking.");
      toast.success("Booking created successfully!");
      return data;
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getMyBookings: async (params = {}) => {
    const { page = 1, limit = 50, eventId, organizerId, searchTerm } = params;
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/my-bookings`);
      const queryParams = { page, limit, eventId, organizerId, searchTerm };
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      const res = await fetch(url, { headers: get().getHeaders() });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to fetch bookings.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getOrganizerBookings: async (params = {}) => {
    const { page = 1, limit = 50, eventId } = params;
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/organizer`);
      const queryParams = { page, limit, eventId };
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
      const res = await fetch(url, { headers: get().getHeaders() });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to fetch organizer bookings.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getDashboardData: async () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/organizer/dashboard`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to load dashboard data.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getStats: async (eventId) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/organizer/stats/${eventId}`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch stats.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  exportBookings: async (eventId) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const url = `${API_BASE}/organizer/export${
        eventId ? `?eventId=${eventId}` : ""
      }`;
      const res = await fetch(url, {
        headers: get().getHeaders(),
      });

      if (!res.ok) throw new Error("Failed to export bookings.");
      toast.success("Bookings exported successfully.");
      return await res.blob();
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getAllBookings: async (params = {}) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}`);

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });

      const res = await fetch(url.toString(), {
        headers: get().getHeaders(),
      });

      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.message || "Failed to fetch bookings.");

      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getBookingById: async (id) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch booking.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  deleteBooking: async (id) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: get().getHeaders(),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to delete booking.");
      toast.success("Booking deleted.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  downloadTicket: async (ticketId) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/ticket/${ticketId}/download`, {
        headers: get().getHeaders(),
      });
      if (!res.ok) throw new Error("Failed to download ticket.");
      toast.success("Ticket downloaded.");
      return await res.blob();
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  getTicketDetails: async (ticketUUID) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tickets/${ticketUUID}`, {
        headers: get().getHeaders(),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to fetch ticket details.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  requestRefund: async (bookingId, reason) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${bookingId}/request-refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...get().getHeaders(),
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to request refund.");
      toast.success("Refund request submitted.");
      await get().getMyBookings();
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },

  processRefund: async (bookingId, { action, amount, adminNotes }) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/${bookingId}/process-refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...get().getHeaders(),
        },
        body: JSON.stringify({ action, amount, adminNotes }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to process refund.");
      toast.success("Refund processed.");
      return data;
    } catch (error) {
      toast.error(error.message);
      setError(error);
    } finally {
      setLoading(false);
    }
  },
  getRefundBookings: async ({ eventId, userId }) => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const url = new URL(`${API_BASE}/refunds`);

      if (eventId) url.searchParams.append("eventId", eventId);
      if (userId) url.searchParams.append("userId", userId);

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          ...get().getHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch refunds.");
      }

      return data;
    } catch (error) {
      toast.error(error.message || "Error fetching refunds");
      setError(error);
    } finally {
      setLoading(false);
    }
  },
  getOrganizerDashboard: async () => {
    const { setLoading, setError } = get();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/organizer/dashboard`, {
        method: "GET",
        headers: {
          ...get().getHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch dashboard data.");
      }
      return data;
    } catch (error) {
      toast.error(error.message || "Error fetching dashboard data");
      setError(error);
    } finally {
      setLoading(false);
    }
  },
}));
