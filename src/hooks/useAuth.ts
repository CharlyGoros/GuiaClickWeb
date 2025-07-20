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
  initialized: boolean;
  error: string | null;
  login: (formData: LoginCredentials) => Promise<User>;
  logout: () => void;
}

// Creamos el store con un init diferido
const useAuth = create<AuthState>((set) => {
  // ⚡ Asíncronamente carga el user/token de localStorage
  setTimeout(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      set({
        user: storedUser ? JSON.parse(storedUser) as User : null,
        token: storedToken ?? null,
        initialized: true,
      });
    } catch (error) {
      console.error("Error cargando usuario desde localStorage:", error);
      set({ user: null, token: null, initialized: true });
    }
  }, 0);

  return {
    user: null,
    token: null,
    loading: false,
    initialized: false,
    error: null,

    login: async (formData) => {
      set({ loading: true, error: null });
      try {
        const response = await login(formData);
        const payload = response.data.body; // ✅ CORREGIDO
        const token = response.data.body.token;

        console.log("Login response:", response.data);
        console.log("Token:", token);
      const user = new User({
  id: payload.id,
  name: payload.name,
  email: payload.email,
  role: Number(payload.role),
  token:token,
});

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        set({ user, token, loading: false });
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, token: null, error: null });
    },
  };
});

export default useAuth;
