import { create } from "zustand";
import Cookies from "js-cookie";

const getUserFromLocalStorage = () => {
  try {
    const storedUser = localStorage.getItem("authUser");
    const role = Cookies.get("role");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (role) {
        user.role = role;
      }
      return user;
    }

    return null;
  } catch {
    return null;
  }
};

const API_BASE =
  "https://event-management-backend-0401.onrender.com/api/v1/auth";

export const useAuthStore = create((set) => ({
  user: getUserFromLocalStorage(),
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Login failed");
      }

      const { accessToken, role, ...userData } = result.data;

      Cookies.set("accessToken", accessToken, { expires: 7 });
      Cookies.set("role", role, { expires: 7 });

      localStorage.setItem("authUser", JSON.stringify(userData));

      set({
        user: userData,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  logout: () => {
    Cookies.remove("accessToken");
    Cookies.remove("role");
    localStorage.removeItem("authUser");
    set({ user: null });
  },
}));
