export type UserRole = 'USER' | 'HOST' | 'ADMIN';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
}
