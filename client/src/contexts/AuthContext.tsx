import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  athleteId: number;
  email: string;
}

interface AuthProvider {
  name: string;
  type: 'oauth' | 'email';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  providers: AuthProvider[];
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  loginWithOAuth: (provider: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<AuthProvider[]>([]);

  useEffect(() => {
    checkAuth();
    fetchProviders();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/providers`,
      );
      if (response.ok) {
        const data = await response.json();
        const providerList: AuthProvider[] = [];

        if (data.emailPassword) {
          providerList.push({ name: 'email', type: 'email' });
        }

        data.oauth?.forEach((provider: string) => {
          providerList.push({ name: provider, type: 'oauth' });
        });

        setProviders(providerList);
      }
    } catch (error) {
      console.error('Failed to fetch providers:', error);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const { user: userData } = await response.json();
    setUser(userData);
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, firstName, lastName }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const { user: userData } = await response.json();
    setUser(userData);
  };

  const loginWithOAuth = (provider: string) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        providers,
        loginWithEmail,
        registerWithEmail,
        loginWithOAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
