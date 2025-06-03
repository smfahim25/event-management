import { create } from "zustand";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const API_BASE = `${import.meta.env.VITE_API_URL}/organizers`;

export const useOrganizerStore = create((set, get) => ({
  loading: false,
  error: null,
  success: false,
  organizers: [],
  organizer: null,
  meta: null,

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

      formData.append("address[street]", formDataObj.address.street);
      formData.append("address[city]", formDataObj.address.city);
      formData.append("address[state]", formDataObj.address.state);
      formData.append("address[zipCode]", formDataObj.address.zipCode);
      formData.append("address[country]", formDataObj.address.country);
      formData.append("address[iso2]", formDataObj.address.countryIso2);

      formData.append(
        "socialMedia[facebook]",
        formDataObj.socialMedia.facebook
      );
      formData.append("socialMedia[twitter]", formDataObj.socialMedia.twitter);
      formData.append(
        "socialMedia[instagram]",
        formDataObj.socialMedia.instagram
      );
      formData.append(
        "socialMedia[linkedin]",
        formDataObj.socialMedia.linkedin
      );

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
      toast.success(
        "Organizer request success. Your request may take up to 24 hours to be approved.",
        {
          duration: 7000,
        }
      );

      set({ success: true });
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  getOrganizers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const { page = 1, limit = 20 } = params;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await fetch(`${API_BASE}?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch organizers.");
      }

      set({
        organizers: data.data,
        meta: data.meta,
      });
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
      return data.data;
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },
  getOrganizerEarnings: async () => {
    set({ loading: true, error: null });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/me/earnings`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch organizer profile.");
      }

      return data.data;
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
  deleteOrganizer: async (organizerId) => {
    set({ loading: true, error: null, success: false });
    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/${organizerId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete organizer.");
      }

      toast.success("Organizer deleted successfully");
      set({ success: true });

      await get().getOrganizers();
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },
  getStripeConnectLink: async () => {
    set({ loading: true, error: null });

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/stripe/connect`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Failed to retrieve Stripe connect link."
        );
      }

      return data;
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  getStripeStatus: async () => {
    set({ loading: true, error: null });

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/stripe/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to retrieve Stripe status.");
      }

      return data;
    } catch (err) {
      set({ error: err.message });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  disconnectStripe: async () => {
    set({ loading: true, error: null });

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Unauthorized. Please login first.");

      const res = await fetch(`${API_BASE}/stripe/disconnect`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to disconnect Stripe.");
      }

      toast.success("Stripe disconnected successfully");

      await get().getStripeStatus();
    } catch (err) {
      set({ error: err.message });
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },
}));
