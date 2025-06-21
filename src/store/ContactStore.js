import toast from "react-hot-toast";
import { create } from "zustand";

const useContactStore = create((set) => ({
  loading: false,
  error: null,
  success: false,
  contactData: null,

  sendContactForm: async (formData) => {
    set({ loading: true, error: null, success: false });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      set({ success: true });
      toast.success("Message sent successfully!");
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchContactData: async () => {
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch contact data");
      }

      const data = await response.json();
      set({ contactData: data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  resetStatus: () => set({ loading: false, error: null, success: false }),
}));

export default useContactStore;
