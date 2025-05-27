import { create } from "zustand";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL;

export const usePayoutStore = create((set, get) => ({
  getHeaders: () => {
    const token = Cookies.get("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  },

  getPayouts: async (organizerId) => {
    try {
      const res = await fetch(
        `${API_BASE}/payouts?organizerId=${organizerId}`,
        {
          method: "GET",
          headers: get().getHeaders(),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      console.error("Error fetching payouts:", err.message);
      toast.error("Failed to fetch payouts.");
      return { data: null, error: err.message };
    }
  },

  createPayout: async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/payouts`, {
        method: "POST",
        headers: get().getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Create failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      toast.success("Payout created successfully!");
      return data;
    } catch (err) {
      console.error("Error creating payout:", err.message);
      toast.error("Failed to create payout.");
      return { data: null, error: err.message };
    }
  },

  updatePayoutStatus: async (payoutId, status) => {
    try {
      const res = await fetch(`${API_BASE}/payouts/${payoutId}`, {
        method: "PATCH",
        headers: get().getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Update failed: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      return { data, error: null };
    } catch (err) {
      console.error("Error updating payout status:", err.message);
      toast.error("Failed to update payout status.");
      return { data: null, error: err.message };
    }
  },
}));
