import axios from 'axios';
import { 
  AuthResponse, 
  LoginCredentials, 
  RegisterCredentials, 
  Conversation, 
  User, 
  UpdateProfilePayload,
  Message 
} from '../types';
import { storage } from '../utils/storage';

// 👇 Use your machine’s IPv4 address from ipconfig
// 👇 Use your backend port (5000), not frontend port (8081)
const API_BASE_URL = "http://10.241.112.70:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 👉 Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await storage.clearAuth();
      // Redirection handled by AuthContext
    }
    return Promise.reject(error);
  }
);

// 🔹 Authentication Service
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export const profileService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/profile/me");
    return response.data;
  },
  updateProfile: async (data: UpdateProfilePayload): Promise<User | null> => {
    try {
      const response = await api.put<{ user: User }>("/profile/me", data);
      return response.data.user;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  },
};

// 🔹 Messaging Service
export const messageService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<Conversation[]>('/message/conversations');
    return response.data;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/message/${conversationId}`);
    return response.data;
  },

  sendMessage: async (conversationId: string, body: string): Promise<Message> => {
    const response = await api.post<Message>('/message/send', {
      conversationId,
      body,
    });
    return response.data;
  },

  createConversation: async (participantIds: string[]): Promise<Conversation> => {
    const response = await api.post<Conversation>('/message/conversation', {
      participantIds,
    });
    return response.data;
  },
};

export default api;
