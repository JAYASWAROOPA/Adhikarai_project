import { create } from 'zustand';
import { ROLES, PERMISSIONS, DEFAULT_USERS } from '../constants/roles';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: true,
  user: {
    ...DEFAULT_USERS.citizen,
    profileCompletion: 85, // 85% complete by default for demo citizen
    isProfileComplete: false // Needs 100% to submit applications
  },
  role: ROLES.CITIZEN,

  login: (userData) => {
    const roleKey = userData?.role?.toLowerCase() || ROLES.CITIZEN;
    set({
      isAuthenticated: true,
      user: {
        ...(DEFAULT_USERS[roleKey] || userData),
        profileCompletion: roleKey === ROLES.CITIZEN ? 85 : 100,
        isProfileComplete: roleKey !== ROLES.CITIZEN
      },
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
      user: {
        ...newUser,
        profileCompletion: roleKey === ROLES.CITIZEN ? (get().user?.profileCompletion || 85) : 100,
        isProfileComplete: roleKey !== ROLES.CITIZEN || (get().user?.profileCompletion === 100)
      },
      role: roleKey
    });
  },

  setProfileCompletion: (percentage) => {
    set((state) => ({
      user: {
        ...state.user,
        profileCompletion: percentage,
        isProfileComplete: percentage >= 100
      }
    }));
  },

  hasPermission: (permission) => {
    const currentRole = get().role || ROLES.CITIZEN;
    const allowedPermissions = PERMISSIONS[currentRole] || [];
    return allowedPermissions.includes(permission);
  }
}));
