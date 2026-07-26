import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: true, // ALWAYS true for now to allow viewing Protected Routes
  user: {
    id: 1,
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh@email.com",
    role: "Citizen"
  },
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));
