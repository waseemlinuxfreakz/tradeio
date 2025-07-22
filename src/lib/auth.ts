import { create } from 'zustand';

const VALID_CREDENTIALS = {
  email: 'ew5933070@gmail.com',
  password: 'Logitech@101'
};

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // Validate credentials
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      set({ isAuthenticated: true, user: { email } });
    } else {
      throw new Error('Invalid credentials');
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  }
}));