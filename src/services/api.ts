import { User } from '@/models/User';
import axios, { AxiosResponse } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponseData {
  message: string;
  user: {
    token: string;
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// const API_BASE_URL: string =
//   'https://api-pdd.netlify.app/.netlify/functions/server/';
const API_BASE_URL: string =
  'http://localhost:3000/.netlify/functions/server';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Helper para loggear y re-lanzar
function handleError(operation: string, error: unknown): never {
  if (axios.isAxiosError(error)) {
    console.error(`${operation}:`, error.response?.data ?? error.message);
  } else if (error instanceof Error) {
    console.error(`${operation}:`, error.message);
  } else {
    console.error(`${operation}:`, error);
  }
  throw error;
}

//
// 1) Tipo para la entrada de registro
//
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

//
// 2) Tipo de la respuesta del servidor al crear usuario
//
interface RegisterResponse {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    role: number;
  };
}

//
// 3) Ajuste de createUser para usar RegisterData
//
export const createUser = async (
  userData: RegisterData
): Promise<RegisterResponse['data']> => {
  try {
    const response = await api.post<RegisterResponse>('/users', userData);
    return response.data.data;
  } catch (error: unknown) {
    handleError('Error creating user', error);
  }
};


export const getUserById = async (
  token: string,
  id: string
): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return new User(response.data);
  } catch (error: unknown) {
    handleError(`Error fetching user ${id}`, error);
  }
};

export const getUsers = async (token: string): Promise<User[]> => {
  try {
    const { data } = await api.get<{ data: User[] }>('/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data.map(u => new User(u));
  } catch (error: unknown) {
    handleError('Error fetching users', error);
  }
};

export const updateUser = async (
  token: string,
  id: string,
  updatedUser: User
): Promise<User> => {
  try {
    const { data } = await api.put<User>(
      `/users/${id}`,
      updatedUser,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return new User(data);
  } catch (error: unknown) {
    handleError(`Error updating user ${id}`, error);
  }
};

export const deleteUserById = async (
  token: string,
  id: string
): Promise<void> => {
  try {
    await api.delete(`/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: unknown) {
    handleError(`Error deleting user ${id}`, error);
  }
};

export const deleteAllUsers = async (token: string): Promise<void> => {
  try {
    await api.delete('/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error: unknown) {
    handleError('Error deleting all users', error);
  }
};

export const makeUserAdmin = async (
  token: string,
  id: string
): Promise<unknown> => {
  try {
    const { data } = await api.put<unknown>(
      `/users/${id}/makeAdmin`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  } catch (error: unknown) {
    handleError(`Error making user ${id} admin`, error);
  }
};

export const makeUserGuest = async (
  token: string,
  id: string
): Promise<void> => {
  try {
    await api.put(
      `/users/${id}/makeGuest`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error: unknown) {
    handleError(`Error making user ${id} guest`, error);
  }
};

export const login = async (
  credentials: LoginCredentials
): Promise<AxiosResponse<LoginResponseData>> => {
  try {
    const { email, password } = credentials;
    return await api.post<LoginResponseData>('/login', { email, password });
  } catch (error: unknown) {
    handleError('Error logging in', error);
  }
};
