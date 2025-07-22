import { create } from 'zustand';
import { login as loginAPI } from '../apis/apiEndpoints'
interface User {
  email: string;
  telegramUsername?: string;
  signalId?:string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  showCredentialsModal: boolean;
  actions: {
    login: (credentials: { email: string; password: string }) => Promise<any>;
    register: (data: { email: string; username: string; password: string; userType: string }) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    setTelegramUsername: (username: string) => void;
    showCredentialsModal: () => void;
    hideCredentialsModal: () => void;
    completeTelegramLogin: (credentials: { email: string; password: string }) => Promise<void>;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false, // Set to true for development
  user: { email: 'demo@example.com' }, // Demo user
  loading: false,
  error: null,
  showCredentialsModal: false,
  actions: {
    login: async (credentials) => {
      set({ loading: true, error: null });
      try {
        // Simulate API call
        
        const response = await loginAPI(credentials);
        if (response.status === 200) {
          // message.success("Login Successfull");
          localStorage.setItem("token", response.data.data.token);
          // navigate("/dashboard");
          set({
            isAuthenticated: true,
            user: { email: credentials.email },
            loading: false
          });
          return response
        } else {
          if (response?.data?.error) {
            // message.error(response?.data?.error);
            return response
          }
        }
        // For demo, accept any credentials

      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Login failed',
          loading: false
        });
        throw error;
      }
    },

    register: async (data) => {
      set({ loading: true, error: null });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        set({
          isAuthenticated: true,
          user: { email: data.email },
          loading: false
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Registration failed',
          loading: false
        });
        throw error;
      }
    },

    logout: () => {
      set({ isAuthenticated: false, user: null });
    },

    clearError: () => {
      set({ error: null });
    },

    setTelegramUsername: (username) => {
      set(state => ({
        isAuthenticated: true,
        user: { ...state.user, telegramUsername: username } as User
      }));
    },

    showCredentialsModal: () => {
      set({ showCredentialsModal: true });
    },

    hideCredentialsModal: () => {
      set({ showCredentialsModal: false });
    },

    completeTelegramLogin: async (credentials) => {
      set({ loading: true, error: null });
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        set({
          isAuthenticated: true,
          user: { email: credentials.email },
          loading: false,
          showCredentialsModal: false
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Login failed',
          loading: false
        });
        throw error;
      }
    }
  }
}));

interface MenuState {
  isOpen: boolean;
  actions: {
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpen: false,
  actions: {
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen }))
  }
}));

interface SideMenuState {
  isOpen: boolean;
  actions: {
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
  };
}

export const useSideMenuStore = create<SideMenuState>((set) => ({
  isOpen: false,
  actions: {
    openMenu: () => set({ isOpen: true }),
    closeMenu: () => set({ isOpen: false }),
    toggleMenu: () => set((state) => ({ isOpen: !state.isOpen }))
  }
}));

interface SwipeState {
  swipeCount: number;
  likes: number;
  dislikes: number;
  actions: {
    recordSwipe: (type: 'like' | 'dislike') => void;
    resetSwipes: () => void;
  };
}

export const useSwipeStore = create<SwipeState>((set) => ({
  swipeCount: 0,
  likes: 0,
  dislikes: 0,
  actions: {
    recordSwipe: (type) => set((state) => ({
      swipeCount: state.swipeCount + 1,
      likes: type === 'like' ? state.likes + 1 : state.likes,
      dislikes: type === 'dislike' ? state.dislikes + 1 : state.dislikes
    })),
    resetSwipes: () => set({ swipeCount: 0, likes: 0, dislikes: 0 })
  }
}));