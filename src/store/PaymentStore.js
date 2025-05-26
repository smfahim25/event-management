import { create } from "zustand";

export const usePaymentStore = create((set) => ({
  isLoading: false,
  error: null,
  sessionData: null,

  createCheckoutSession: async ({
    amount,
    currency,
    userId,
    bookingId,
    eventId,
    eventName,
  }) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(
        "https://api.lessortiesdediane.com/api/v1/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            userId,
            bookingId,
            eventId,
            eventName,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to create session");

      const data = await response.json();
      set({ sessionData: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
