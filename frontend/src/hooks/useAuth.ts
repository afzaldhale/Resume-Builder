import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

/**
 * Hook for Firebase authentication state management
 * - Initializes auth state on mount
 * - Listens to auth changes
 * - Syncs with Zustand store
 */
export const useAuth = () => {
  const { user, profile, loading, isAuthenticated, isAdmin, setUser, setProfile, setLoading } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          const userProfile = await authService.getUserProfile(firebaseUser.uid);
          setProfile(userProfile as any);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setLoading]);

  return {
    user,
    profile,
    loading,
    isAuthenticated,
    isAdmin,
  };
};
