import { create } from 'zustand';
import { ROLES, PERMISSIONS, DEFAULT_USERS } from '../constants/roles';

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, token: null, user: null, role: null };
  }

  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const storedRole = localStorage.getItem('role');

  return {
    isAuthenticated: Boolean(token),
    token,
    user: storedUser ? JSON.parse(storedUser) : null,
    role: storedRole || null
  };
};

const persistAuthState = (state) => {
  if (typeof window === 'undefined') return;

  if (state.token) {
    localStorage.setItem('token', state.token);
  } else {
    localStorage.removeItem('token');
  }

  if (state.user) {
    localStorage.setItem('user', JSON.stringify(state.user));
  } else {
    localStorage.removeItem('user');
  }

  if (state.role) {
    localStorage.setItem('role', state.role);
  } else {
    localStorage.removeItem('role');
  }
};

export const useAuthStore = create((set, get) => {
  const storedAuth = readStoredAuth();

  return {
    isAuthenticated: storedAuth.isAuthenticated,
    token: storedAuth.token,
    user: storedAuth.user,
    role: storedAuth.role,

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
      const defaultCitizen = DEFAULT_USERS[roleKey] || {};
      const resolvedUser = {
        ...defaultCitizen,
        ...(userObj || {}),
        wallet: userObj?.wallet ?? defaultCitizen.wallet ?? 24500,
        profileCompletion: roleKey === ROLES.CITIZEN ? (userObj?.profileCompletion ?? defaultCitizen.profileCompletion ?? 100) : 100,
        isProfileComplete: roleKey !== ROLES.CITIZEN || (userObj?.isProfileComplete ?? defaultCitizen.isProfileComplete ?? true)
      };

      const nextState = {
        isAuthenticated: true,
        token: token || 'mock_jwt_token',
        user: resolvedUser,
        role: roleKey
      };

      persistAuthState(nextState);
      set(nextState);
    },

    logout: () => {
      const nextState = { isAuthenticated: false, token: null, user: null, role: null };
      persistAuthState(nextState);
      set(nextState);
    },

    switchRole: (targetRole) => {
      const roleKey = targetRole.toLowerCase();
      const newUser = DEFAULT_USERS[roleKey] || {
        ...get().user,
        role: roleKey
      };
      const mockToken = `jwt_token_${roleKey}_` + Date.now();
      const nextState = {
        isAuthenticated: true,
        token: mockToken,
        user: {
          ...newUser,
          wallet: newUser.wallet ?? 24500,
          profileCompletion: roleKey === ROLES.CITIZEN ? (newUser.profileCompletion ?? 100) : 100,
          isProfileComplete: roleKey !== ROLES.CITIZEN || (newUser.isProfileComplete ?? true)
        },
        role: roleKey
      };

      persistAuthState(nextState);
      set(nextState);
    },

    setProfileCompletion: (percentage) => {
      set((state) => {
        const nextUser = {
          ...state.user,
          profileCompletion: percentage,
          isProfileComplete: percentage >= 100
        };

        persistAuthState({ ...state, user: nextUser });
        return { user: nextUser };
      });
    },

    hasPermission: (permission) => {
      const currentRole = get().role || ROLES.CITIZEN;
      const allowedPermissions = PERMISSIONS[currentRole] || [];
      return allowedPermissions.includes(permission);
    }
  };
});
