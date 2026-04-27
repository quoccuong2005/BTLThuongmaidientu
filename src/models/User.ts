// MODEL: User
export interface User {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  location: string;
  joinedAt: string;
  totalListings: number;
  rating: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
