import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE =
  "https://event-management-backend-0401.onrender.com/api/v1/organizers";

export const useOrganizerStore = create((set) => ({
  loading: false,
  error: null,
  success: false,
  organizers: [],
  organizer: null,

  createOrganizer: async (formDataObj) => {
    set({ loading: true, error: null, success: false });

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const formData = new FormData();

      formData.append("organizationName", formDataObj.organizationName);
      formData.append("description", formDataObj.description);
      formData.append("logo", formDataObj.logo);
      formData.append("website", formDataObj.website);
      formData.append("commissionRate", formDataObj.commissionRate);
      formData.append("payoutSchedule", formDataObj.payoutSchedule);

      formData.append("address", JSON.stringify(formDataObj.address));
      formData.append("socialMedia", JSON.stringify(formDataObj.socialMedia));

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create organizer.");
      }
      toast.success("Organizer created successfully");
      set({ success: true });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  getOrganizers: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(API_BASE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch organizers.");
      }

      set({ organizers: data.data });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  getOrganizerProfile: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch organizer profile.");
      }

      set({ organizer: data.data });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  updateOrganizerProfile: async (formDataObj) => {
    set({ loading: true, error: null, success: false });

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataObj,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update organizer.");
      }
      toast.success("Organizer profile updated successfully");
      set({ success: true, organizer: data.data });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  approveOrganizer: async (organizerId) => {
    set({ loading: true, error: null, success: false });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/${organizerId}/approve`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to approve organizer.");
      }
      toast.success("Organizer approved successfully");
      set({ success: true });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  rejectOrganizer: async (organizerId, reason) => {
    set({ loading: true, error: null, success: false });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/${organizerId}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to reject organizer.");
      }
      toast.success("Organizer rejected successfully");
      set({ success: true });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },
}));
