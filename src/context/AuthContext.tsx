import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';

interface UserPreferences {
  streakCount: number;
  lastReadSurah: number;
  lastReadPage: number;
  reciterId: string;
  theme: string;
  fontSize: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  preferences: UserPreferences | null;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  refreshPreferences: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  const fetchTokenAndSync = async (currentUser: User) => {
    try {
      const idToken = await currentUser.getIdToken();
      setToken(idToken);

      // Sync user with Cloud SQL backend
      const res = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          displayName: currentUser.displayName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.preferences) {
          setPreferences(data.preferences);
        }
      }
    } catch (err) {
      console.error('Failed to sync auth with Cloud SQL:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchTokenAndSync(currentUser);
      } else {
        setToken(null);
        setPreferences(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error('Google Sign In error:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign Out error:', error);
      throw error;
    }
  };

  const refreshPreferences = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/user/preferences', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPreferences(data);
      }
    } catch (err) {
      console.error('Failed to refresh preferences:', err);
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    if (!token) return;
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        const updated = await res.json();
        setPreferences(updated);
      }
    } catch (err) {
      console.error('Failed to update preferences in Cloud SQL:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        preferences,
        signInWithGoogle,
        logOut,
        refreshPreferences,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
