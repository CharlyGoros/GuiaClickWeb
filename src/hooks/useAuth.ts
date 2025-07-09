import { create } from 'zustand';
import axios from 'axios';
import { login } from '@/services/api';
import { User } from '@/models/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (formData: LoginCredentials) => Promise<User>;
  logout: () => void;
}

const getStoredAuthData = (): { user: User | null; token: string | null } => {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');
  return {
    user: storedUser ? JSON.parse(storedUser) as User : null,
    token: storedToken ?? null,
  };
};

const useAuth = create<AuthState>((set) => ({
  ...getStoredAuthData(),
  loading: false,
  error: null,

  login: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await login(formData);
      // ——— Aquí cambiamos:
      const payload = response.data.user;
      const token   = payload.token;
      // Normaliza el role a number si tu modelo lo espera así
      const user    = new User({
        id:    payload.id,
        name:  payload.name,
        email: payload.email,
        role:  Number(payload.role),
      });

      set({ user, token, loading: false });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (err: unknown) {
      let message = 'Error desconocido';
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: () => {
    set({ user: null, token: null, error: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
}));

export default useAuth;
