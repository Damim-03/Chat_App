export interface User {
  id: string;
  username: string;
  fullname: string;
  gender: 'male' | 'female';
  profilePic: string;
  createdAt: string;
  updatedAt: string;
}

// Define the payload for updating profile
export interface UpdateProfilePayload {
  fullname?: string;
  username?: string;
  profilePic?: string;
  gender?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  sender: User;
}

export interface Conversation {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: User[];
  messages: Message[];
  lastMessage?: Message;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female';
  profilePic: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
