import { create } from 'zustand';
import { ROLES, PERMISSIONS, DEFAULT_USERS } from '../constants/roles';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: true,
  user: DEFAULT_USERS.citizen, // Default to citizen
  role: ROLES.CITIZEN,

  login: (userData) => {
    const roleKey = userData?.role?.toLowerCase() || ROLES.CITIZEN;
    set({
      isAuthenticated: true,
      user: userData,
      role: roleKey
    });
  },

  logout: () => set({ isAuthenticated: false, user: null, role: null }),

  switchRole: (targetRole) => {
    const roleKey = targetRole.toLowerCase();
    const newUser = DEFAULT_USERS[roleKey] || {
      ...get().user,
      role: roleKey
    };
    set({
      isAuthenticated: true,
      user: newUser,
      role: roleKey
    });
  },

  hasPermission: (permission) => {
    const currentRole = get().role || ROLES.CITIZEN;
    const allowedPermissions = PERMISSIONS[currentRole] || [];
    return allowedPermissions.includes(permission);
  }
}));
