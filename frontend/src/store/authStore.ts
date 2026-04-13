import { create } from 'zustand';
import { User } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  candidateType: 'fresher' | 'experienced';
  profileImageURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AuthStore {
  // State
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<UserProfile>) => void;
  changeCandidateType: (candidateType: 'fresher' | 'experienced') => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user ? state.profile?.role === 'admin' : false,
    })),

  setProfile: (profile) =>
    set((state) => ({
      profile,
      isAdmin: profile?.role === 'admin' ? true : false,
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  logout: () =>
    set({
      user: null,
      profile: null,
      error: null,
      isAuthenticated: false,
      isAdmin: false,
    }),

  updateProfile: (updatedProfile) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updatedProfile } : null,
    })),

  changeCandidateType: (candidateType) =>
    set((state) => ({
      profile: state.profile
        ? { ...state.profile, candidateType }
        : null,
    })),
}));
