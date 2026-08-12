import { create } from 'zustand';
import { ROLES, PERMISSIONS, DEFAULT_USERS } from '../constants/roles';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  role: null,

  login: (tokenOrData, userData) => {
    let token = null;
    let userObj = null;

    if (typeof tokenOrData === 'string') {
      token = tokenOrData;
      userObj = userData;
    } else {
      userObj = tokenOrData;
      token = 'mock_jwt_token_' + Date.now();
    }

    const roleKey = (userObj?.role || 'citizen').toLowerCase();
    
    if (token) {
      localStorage.setItem('token', token);
    }

    set({
      isAuthenticated: true,
      token: token || 'mock_jwt_token',
      user: {
        ...(DEFAULT_USERS[roleKey] || userObj),
        profileCompletion: roleKey === ROLES.CITIZEN ? (userObj?.profileCompletion || 85) : 100,
        isProfileComplete: roleKey !== ROLES.CITIZEN || (userObj?.profileCompletion === 100)
      },
      role: roleKey
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: null, user: null, role: null });
  },

  switchRole: (targetRole) => {
    const roleKey = targetRole.toLowerCase();
    const newUser = DEFAULT_USERS[roleKey] || {
      ...get().user,
      role: roleKey
    };
    
    const mockToken = `jwt_token_${roleKey}_` + Date.now();
    localStorage.setItem('token', mockToken);

    set({
      isAuthenticated: true,
      token: mockToken,
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
